'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute, useAuth } from '@matchpro/ui';
import { JobService } from '../services/jobService';
import { SearchFilters } from '../components/JobSearch/SearchFilters';
import { JobCard } from '../components/JobSearch/JobCard';
import type { JobSearchFilters } from '../types';

export default function JobMatchingPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<JobSearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: jobsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['jobs', filters, currentPage],
    queryFn: () => JobService.searchJobs(filters, currentPage),
  });

  const { data: savedJobs } = useQuery({
    queryKey: ['savedJobs', user?.id],
    queryFn: () => (user?.id ? JobService.getSavedJobs(user.id) : Promise.resolve([])),
    enabled: !!user?.id,
  });

  const handleFilterChange = (newFilters: JobSearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user?.id) return;
    try {
      await JobService.saveJob(user.id, jobId);
      // Invalidate saved jobs query to refresh the list
      // You'll need to set up React Query's queryClient
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    if (!user?.id) return;
    // You might want to show a modal to select which resume to use
    // For now, we'll just use a default resumeId
    const resumeId = 'default-resume-id';
    try {
      await JobService.applyToJob(user.id, jobId, resumeId);
      // Show success message
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Matching</h1>
            <p className="mt-2 text-lg text-gray-600">
              Find jobs that match your skills and experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Job Results */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800">
                    Error loading jobs. Please try again later.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {jobsData?.jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSave={() => handleSaveJob(job.id)}
                      onApply={() => handleApplyToJob(job.id)}
                      isSaved={savedJobs?.some((saved) => saved.id === job.id)}
                    />
                  ))}

                  {/* Pagination */}
                  {jobsData && jobsData.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: jobsData.totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
