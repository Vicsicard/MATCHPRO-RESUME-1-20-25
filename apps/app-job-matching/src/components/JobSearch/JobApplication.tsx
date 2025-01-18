import React, { useState } from 'react';
import { Button, Card } from '@matchpro/ui';
import { OpenAIService } from '@matchpro/data/src/services/openai';
import { Job } from '../../types';

interface JobApplicationProps {
  job: Job;
  resumeText: string;
  onClose: () => void;
  onApply: (coverLetter: string) => Promise<void>;
}

export function JobApplication({
  job,
  resumeText,
  onClose,
  onApply,
}: JobApplicationProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    analyzeJobMatch();
  }, []);

  const analyzeJobMatch = async () => {
    try {
      const result = await OpenAIService.analyzeJobMatch(
        resumeText,
        job.description
      );
      setAnalysis(result);
    } catch (error) {
      setError('Failed to analyze job match. Please try again.');
      console.error('Error analyzing job match:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    try {
      const letter = await OpenAIService.generateCoverLetter(
        resumeText,
        job.description
      );
      setCoverLetter(letter);
    } catch (error) {
      setError('Failed to generate cover letter. Please try again.');
      console.error('Error generating cover letter:', error);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleApply = async () => {
    try {
      await onApply(coverLetter);
      onClose();
    } catch (error) {
      setError('Failed to submit application. Please try again.');
      console.error('Error submitting application:', error);
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
            Analyzing job match...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-900">
            Job Application
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Match Analysis
              </h3>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {analysis.matchScore}% Match
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Matching Skills:</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.matchingSkills.map((skill: string) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Missing Skills:</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill: string) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Recommendations:</h4>
              <ul className="mt-2 space-y-2">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-gray-600">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Cover Letter
            </h3>
            {!coverLetter && (
              <Button
                onClick={handleGenerateCoverLetter}
                variant="outlined"
                size="small"
                loading={isGeneratingCoverLetter}
              >
                Generate Cover Letter
              </Button>
            )}
          </div>

          {coverLetter && (
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {coverLetter}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!coverLetter}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </Card>
  );
}
