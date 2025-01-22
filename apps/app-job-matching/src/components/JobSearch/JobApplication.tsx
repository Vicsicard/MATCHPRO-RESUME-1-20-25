'use client';

import React, { useState } from 'react';
import { Button, Card } from '@matchpro/ui';
import { OpenAIService } from '@matchpro/data';
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
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    analyzeJobMatch();
  }, []);

  const analyzeJobMatch = async () => {
    try {
      const result = await OpenAIService.analyzeJobMatch({
        resumeContent: resumeText,
        jobDescription: job.description,
      });
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
      const letter = await OpenAIService.generateCoverLetter({
        resumeContent: resumeText,
        jobDescription: job.description,
      });
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

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={onClose}>Close</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Job Application Analysis</h2>

      {isAnalyzing ? (
        <div className="text-center">Analyzing job match...</div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Match Analysis</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {analysis}
            </div>
          </div>

          {!coverLetter && (
            <Button
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingCoverLetter}
              className="w-full"
            >
              {isGeneratingCoverLetter
                ? 'Generating Cover Letter...'
                : 'Generate Cover Letter'}
            </Button>
          )}

          {coverLetter && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Cover Letter</h3>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap mb-4">
                {coverLetter}
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleApply}>Submit Application</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
