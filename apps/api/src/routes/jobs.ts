import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import type { Request, Response, Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

interface JobSearchFilters {
  query?: string;
  location?: string;
  employmentType?: string[];
  remoteType?: string[];
  minSalary?: number;
  postedWithin?: number;
  sortBy?: 'relevance' | 'date' | 'salary';
  page?: string;
}

// Search jobs with filters
router.get('/search', async (req: Request<{}, {}, {}, JobSearchFilters>, res: Response) => {
  try {
    const filters = req.query;
    const page = parseInt(filters.page || '1');
    const limit = 10;
    const offset = (page - 1) * limit;

    let query = supabase.from('jobs').select('*', { count: 'exact' });

    // Apply filters
    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.employmentType?.length) {
      query = query.in('employment_type', filters.employmentType);
    }
    if (filters.remoteType?.length) {
      query = query.in('remote_type', filters.remoteType);
    }
    if (filters.minSalary) {
      query = query.gte('salary_range->>min', filters.minSalary);
    }
    if (filters.postedWithin) {
      const date = new Date();
      date.setDate(date.getDate() - filters.postedWithin);
      query = query.gte('posted_date', date.toISOString());
    }

    // Apply sorting
    if (filters.sortBy === 'date') {
      query = query.order('posted_date', { ascending: false });
    } else if (filters.sortBy === 'salary') {
      query = query.order('salary_range->min', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, count, error } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return res.json({
      jobs,
      total: count,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    return res.status(500).json({ error: 'Failed to search jobs' });
  }
});

// Get job details
router.get('/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.json(job);
  } catch (error) {
    console.error('Error getting job details:', error);
    return res.status(500).json({ error: 'Failed to get job details' });
  }
});

// Get job matches for a resume
router.get('/matches/:resumeId', authenticate, async (req: Request, res: Response) => {
  try {
    const { resumeId } = req.params;
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('skills, experience')
      .eq('id', resumeId)
      .single();

    if (resumeError) throw resumeError;
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Get jobs that match the resume's skills
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .contains('required_skills', resume.skills);

    if (jobsError) throw jobsError;

    return res.json(jobs);
  } catch (error) {
    console.error('Error getting job matches:', error);
    return res.status(500).json({ error: 'Failed to get job matches' });
  }
});

// Save a job for a user
router.post('/:userId/saved-jobs', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { jobId } = req.body;

    const { error } = await supabase.from('saved_jobs').insert({
      user_id: userId,
      job_id: jobId,
    });

    if (error) throw error;

    return res.status(201).json({ message: 'Job saved successfully' });
  } catch (error) {
    console.error('Error saving job:', error);
    return res.status(500).json({ error: 'Failed to save job' });
  }
});

// Get saved jobs for a user
router.get('/:userId/saved-jobs', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { data: savedJobs, error } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', userId);

    if (error) throw error;

    if (!savedJobs.length) {
      return res.json([]);
    }

    const jobIds = savedJobs.map((saved) => saved.job_id);
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .in('id', jobIds);

    if (jobsError) throw jobsError;

    return res.json(jobs);
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    return res.status(500).json({ error: 'Failed to get saved jobs' });
  }
});

export default router;
