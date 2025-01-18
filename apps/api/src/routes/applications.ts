import express, { Router } from 'express';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';
import { JobApplicationSchema } from '../types';

const router: Router = express.Router();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all job applications for the authenticated user
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of job applications with related jobs and resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/JobApplication'
 *                   - type: object
 *                     properties:
 *                       jobs:
 *                         type: object
 *                       resumes:
 *                         $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs (*),
        resumes (*)
      `)
      .eq('userId', req.user!.id)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit a new job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - resumeId
 *             properties:
 *               jobId:
 *                 type: string
 *                 format: uuid
 *               resumeId:
 *                 type: string
 *                 format: uuid
 *               coverLetter:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobApplication'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const applicationData = JobApplicationSchema.parse({
      ...req.body,
      userId: req.user!.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Verify that the resume belongs to the user
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', applicationData.resumeId)
      .eq('userId', req.user!.id)
      .single();

    if (resumeError || !resume) {
      return res.status(404).json({ error: 'Resume not found or does not belong to user' });
    }

    // Create the application
    const { data, error } = await supabase
      .from('job_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating application:', error);
    return res.status(500).json({ error: 'Failed to create application' });
  }
});

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get a specific job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Job application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobApplication'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', req.params.id)
      .eq('userId', req.user!.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ error: 'Failed to fetch application' });
  }
});

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update a job application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, SUBMITTED, VIEWED, REJECTED, ACCEPTED]
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobApplication'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const status = z.enum(['PENDING', 'SUBMITTED', 'VIEWED', 'REJECTED', 'ACCEPTED'])
      .parse(req.body.status);

    const { data, error } = await supabase
      .from('job_applications')
      .update({
        status,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .eq('userId', req.user!.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Error updating application status:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    } else {
      return res.status(500).json({ error: 'Failed to update application status' });
    }
  }
});

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete a job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Application ID
 *     responses:
 *       204:
 *         description: Application deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    // First check if the application exists and belongs to the user
    const { data: existingApp, error: fetchError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', req.params.id)
      .eq('userId', req.user!.id)
      .single();

    if (fetchError || !existingApp) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', req.params.id)
      .eq('userId', req.user!.id);

    if (error) throw error;

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting application:', error);
    return res.status(500).json({ error: 'Failed to delete application' });
  }
});

export default router;
