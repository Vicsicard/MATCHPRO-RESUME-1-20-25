import axios, { AxiosError } from 'axios';
import { Job, JobSearchFilters, JobSearchResponse } from '../types';

console.log('API_BASE_URL:', process.env.NEXT_PUBLIC_API_URL); // Debug log

export class JobService {
  static async searchJobs(
    filters: JobSearchFilters,
    page: number = 1
  ): Promise<JobSearchResponse> {
    try {
      console.log('Searching jobs with filters:', { filters, page });
      console.log('Request URL:', '/api/jobs/search');
      
      const response = await axios.get('/api/jobs/search', {
        params: {
          ...filters,
          page,
        },
      });
      
      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', {
        error,
        status: (error as AxiosError)?.response?.status,
        data: (error as AxiosError)?.response?.data,
        config: (error as AxiosError)?.config,
      });
      throw error;
    }
  }

  static async getJobDetails(jobId: string): Promise<Job> {
    try {
      console.log('Getting job details for ID:', jobId);
      const response = await axios.get(`/api/jobs/${jobId}`);
      console.log('Job details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting job details:', {
        error,
        jobId,
        status: (error as AxiosError)?.response?.status,
        data: (error as AxiosError)?.response?.data,
      });
      throw error;
    }
  }

  static async getJobMatches(resumeId: string): Promise<Job[]> {
    try {
      console.log('Getting job matches for resume:', resumeId);
      const response = await axios.get(
        `/api/jobs/matches/${resumeId}`
      );
      console.log('Job matches response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting job matches:', {
        error,
        resumeId,
        status: (error as AxiosError)?.response?.status,
        data: (error as AxiosError)?.response?.data,
      });
      throw error;
    }
  }

  static async saveJob(userId: string, jobId: string): Promise<void> {
    try {
      console.log('Saving job:', { userId, jobId });
      await axios.post(`/api/users/${userId}/saved-jobs`, {
        jobId,
      });
      console.log('Job saved successfully');
    } catch (error) {
      console.error('Error saving job:', {
        error,
        userId,
        jobId,
        status: (error as AxiosError)?.response?.status,
        data: (error as AxiosError)?.response?.data,
      });
      throw error;
    }
  }

  static async getSavedJobs(userId: string): Promise<Job[]> {
    try {
      console.log('Getting saved jobs for user:', userId);
      const response = await axios.get(`/api/users/${userId}/saved-jobs`);
      console.log('Saved jobs response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting saved jobs:', {
        error,
        userId,
        status: (error as AxiosError)?.response?.status,
        data: (error as AxiosError)?.response?.data,
      });
      throw error;
    }
  }

  static async applyToJob(
    userId: string,
    jobId: string,
    resumeId: string
  ): Promise<void> {
    try {
      console.log('Applying to job:', { userId, jobId, resumeId });
      await axios.post(`/api/jobs/${jobId}/apply`, {
        userId,
        resumeId,
      });
      console.log('Job applied successfully');
    } catch (error) {
      console.error('Error applying to job:', {
        error,
        userId,
        jobId,
        resumeId,
        status: (error as AxiosError)?.response?.status,
        data: (error as AxiosError)?.response?.data,
      });
      throw error;
    }
  }
}
