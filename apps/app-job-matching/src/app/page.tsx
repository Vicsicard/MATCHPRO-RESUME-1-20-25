'use client';

import React, { useState, useEffect } from 'react';
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

  // Debug logs
  useEffect(() => {
    console.log('JobMatchingPage mounted');
    console.log('Initial state:', { filters, currentPage });
    console.log('User:', user);
  }, []);

  useEffect(() => {
    console.log('Filters or page changed:', { filters, currentPage });
  }, [filters, currentPage]);

  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['jobs', filters, currentPage],
    queryFn: () => JobService.searchJobs(filters, currentPage),
    onError: (error) => {
      console.error('Error in jobs query:', error);
    },
  });

  const { data: savedJobs, error: savedJobsError } = useQuery({
    queryKey: ['savedJobs', user?.id],
    queryFn: () => (user?.id ? JobService.getSavedJobs(user.id) : Promise.resolve([])),
    enabled: !!user?.id,
    onError: (error) => {
      console.error('Error in saved jobs query:', error);
    },
  });

  const handleFilterChange = (newFilters: JobSearchFilters) => {
    console.log('Filter change:', { oldFilters: filters, newFilters });
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user?.id) {
      console.log('Cannot save job: User not logged in');
      return;
    }
    try {
      console.log('Saving job:', { userId: user.id, jobId });
      await JobService.saveJob(user.id, jobId);
      console.log('Job saved successfully');
    } catch (error) {
      console.error('Error in handleSaveJob:', error);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    if (!user?.id) {
      console.log('Cannot apply to job: User not logged in');
      return;
    }
    try {
      console.log('Applying to job:', { userId: user.id, jobId });
      const resumeId = 'default-resume-id';
      await JobService.applyToJob(user.id, jobId, resumeId);
      console.log('Job application submitted successfully');
    } catch (error) {
      console.error('Error in handleApplyToJob:', error);
    }
  };

  // Debug logs for render
  console.log('Rendering JobMatchingPage:', {
    isLoading,
    error,
    jobsCount: jobsData?.jobs?.length,
    savedJobsCount: savedJobs?.length,
    savedJobsError,
  });

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Job Matching</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
          
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-800">Error loading jobs</h3>
                <p className="text-red-600 mt-2">{(error as Error).message}</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            ) : jobsData?.jobs?.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium text-gray-600">No jobs found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobsData?.jobs?.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={() => handleSaveJob(job.id)}
                    onApply={() => handleApplyToJob(job.id)}
                    isSaved={savedJobs?.some((saved) => saved.id === job.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
