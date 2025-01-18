import React, { useState } from 'react';
import { format } from 'date-fns';
import { Job } from '../../types';
import { Button } from '@matchpro/ui';
import { JobApplication } from './JobApplication';

interface JobCardProps {
  job: Job;
  onSave?: () => void;
  onApply?: (coverLetter: string) => Promise<void>;
  isSaved?: boolean;
  resumeText?: string;
}

export function JobCard({ job, onSave, onApply, isSaved, resumeText }: JobCardProps) {
  const [showApplication, setShowApplication] = useState(false);

  const handleApply = async (coverLetter: string) => {
    if (onApply) {
      await onApply(coverLetter);
      setShowApplication(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
          {job.match_score && (
            <div className="flex items-center">
              <div className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {job.match_score}% Match
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg
              className="mr-1.5 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {job.location}
          </div>
          <div className="flex items-center">
            <svg
              className="mr-1.5 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {job.employment_type.replace('_', ' ')}
          </div>
          <div className="flex items-center">
            <svg
              className="mr-1.5 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Posted {format(new Date(job.posted_date), 'MMM d, yyyy')}
          </div>
          {job.salary_range && (
            <div className="flex items-center">
              <svg
                className="mr-1.5 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {job.salary_range.currency}{job.salary_range.min.toLocaleString()} - {job.salary_range.max.toLocaleString()}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 line-clamp-3">{job.description}</p>

        {/* Skills Match */}
        {job.skills_match && (
          <div className="space-y-2">
            {job.skills_match.matching.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Matching Skills:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {job.skills_match.matching.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {job.skills_match.missing.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Missing Skills:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {job.skills_match.missing.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            onClick={onSave}
            variant="outlined"
            color={isSaved ? 'secondary' : 'primary'}
          >
            {isSaved ? 'Saved' : 'Save Job'}
          </Button>
          <Button 
            onClick={() => setShowApplication(true)}
            disabled={!resumeText}
          >
            Apply Now
          </Button>
        </div>
      </div>

      {/* Job Application Modal */}
      {showApplication && resumeText && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <JobApplication
                job={job}
                resumeText={resumeText}
                onClose={() => setShowApplication(false)}
                onApply={handleApply}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
