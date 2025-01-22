'use client';

import { useState } from 'react';
import { Button } from '@matchpro/ui';

interface ResumeOptimizerProps {
  userId: string;
}

export function ResumeOptimizer({ userId }: ResumeOptimizerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [optimizedText, setOptimizedText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/optimize-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to optimize resume');
      }

      const data = await response.json();
      setOptimizedText(data.optimizedText);
    } catch (error) {
      console.error('Error optimizing resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="inline-flex items-center px-4 py-2"
        >
          {isLoading ? 'Optimizing...' : 'Optimize Resume'}
        </Button>
      </div>

      {optimizedText && (
        <div className="mt-4">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Optimized Resume</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap">{optimizedText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
