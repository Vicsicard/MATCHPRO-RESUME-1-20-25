import React, { useState } from 'react';
import { Button, Card } from '@matchpro/ui';
import { optimizeResume, analyzeJobMatch } from '@matchpro/data/src/services/openai';
import { extractTextFromDocument } from '@matchpro/data/src/services/document';
import { createResume, createJobApplication, saveOptimizationResult } from '@matchpro/data/src/services/database';

interface ResumeOptimizerProps {
  userId: string;
}

export function ResumeOptimizer({ userId }: ResumeOptimizerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleOptimize = async () => {
    if (!file || !jobDescription) return;

    try {
      setLoading(true);

      // Convert file to buffer and extract text
      const buffer = await file.arrayBuffer();
      const resumeText = await extractTextFromDocument(
        Buffer.from(buffer),
        file.name
      );

      // Create resume record
      const resume = await createResume(userId, file.name, resumeText);

      // Create job application record
      const jobApplication = await createJobApplication(
        userId,
        resume.id,
        'Company', // This could be extracted from job description or input separately
        'Position', // This could be extracted from job description or input separately
        jobDescription
      );

      // Optimize resume
      const optimizedContent = await optimizeResume({
        resumeText,
        jobDescription,
      });

      // Analyze match
      const matchAnalysis = await analyzeJobMatch({
        resumeText,
        jobDescription,
      });

      // Save optimization result
      await saveOptimizationResult(
        userId,
        resume.id,
        jobApplication.id,
        resumeText,
        optimizedContent
      );

      setResult(`
        Optimization Suggestions:
        ${optimizedContent}

        Match Analysis:
        ${matchAnalysis}
      `);
    } catch (error) {
      console.error('Error optimizing resume:', error);
      setResult('An error occurred while optimizing your resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Resume (PDF or DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Paste the job description here..."
          />
        </div>

        <Button
          onClick={handleOptimize}
          loading={loading}
          disabled={!file || !jobDescription}
          className="w-full"
        >
          Optimize Resume
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </Card>
  );
}
