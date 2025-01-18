import axios from 'axios';
import { Job, JobSearchFilters, JobSearchResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class JobService {
  static async searchJobs(
    filters: JobSearchFilters,
    page: number = 1
  ): Promise<JobSearchResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/jobs/search`, {
        params: {
          ...filters,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }

  static async getJobDetails(jobId: string): Promise<Job> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting job details:', error);
      throw error;
    }
  }

  static async getJobMatches(resumeId: string): Promise<Job[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/jobs/matches/${resumeId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting job matches:', error);
      throw error;
    }
  }

  static async saveJob(userId: string, jobId: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/users/${userId}/saved-jobs`, {
        jobId,
      });
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  static async getSavedJobs(userId: string): Promise<Job[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/${userId}/saved-jobs`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting saved jobs:', error);
      throw error;
    }
  }

  static async applyToJob(
    userId: string,
    jobId: string,
    resumeId: string
  ): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/jobs/${jobId}/apply`, {
        userId,
        resumeId,
      });
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  }
}
