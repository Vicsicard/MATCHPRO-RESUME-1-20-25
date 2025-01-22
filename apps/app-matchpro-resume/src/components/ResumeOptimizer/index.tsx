'use client';

import React, { useState } from 'react';
import { Button } from '@matchpro/ui';
import { Card } from '@matchpro/ui';

interface ResumeOptimizerProps {
  userId: string;
}

export function ResumeOptimizer({ userId }: ResumeOptimizerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedContent, setOptimizedContent] = useState<string | null>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError('Please provide both a resume file and job description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);
      formData.append('userId', userId);

      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to optimize resume');
      }

      const data = await response.json();
      setOptimizedContent(data.optimizedContent);
      setMatchAnalysis(data.matchAnalysis);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Resume Optimizer</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={6}
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full justify-center"
        >
          {loading ? 'Processing...' : 'Optimize Resume'}
        </Button>

        {optimizedContent && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Optimized Content</h3>
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {optimizedContent}
            </div>
          </div>
        )}

        {matchAnalysis && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Match Analysis</h3>
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {matchAnalysis}
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
