import express, { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';
import { ResumeSchema } from '../types';
import { PDFExtract, PDFExtractResult } from 'pdf.js-extract';
import mammoth from 'mammoth';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: Get all resumes for the authenticated user
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('userId', req.user!.id)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

/**
 * @swagger
 * /api/resumes/upload:
 *   post:
 *     summary: Upload a new resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *             required:
 *               - file
 *               - title
 *     responses:
 *       201:
 *         description: Resume uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/upload', authenticate, upload.single('file'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const title = z.string().min(1).parse(req.body.title);
    const fileType = req.file.mimetype === 'application/pdf' ? 'PDF' : 'DOCX';

    // Extract text content from file
    let content = '';
    if (fileType === 'PDF') {
      const pdfExtract = new PDFExtract();
      const data = await pdfExtract.extract(req.file.buffer.toString('base64'));
      const result: PDFExtractResult = await data;
      content = result.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
    } else {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      content = result.value;
    }

    // Upload file to storage
    const fileName = `${req.user!.id}/${Date.now()}-${req.file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) throw uploadError;

    // Create resume record
    const resumeData = ResumeSchema.parse({
      userId: req.user!.id,
      title,
      content,
      fileUrl: uploadData.path,
      fileType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from('resumes')
      .insert([resumeData])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error uploading resume:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    } else {
      return res.status(500).json({ error: 'Failed to upload resume' });
    }
  }
});

/**
 * @swagger
 * /api/resumes/{id}:
 *   get:
 *     summary: Get a specific resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Resume
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', req.params.id)
      .eq('userId', req.user!.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

/**
 * @swagger
 * /api/resumes/{id}:
 *   delete:
 *     summary: Delete a resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Resume ID
 *     responses:
 *       204:
 *         description: Resume deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    // First check if the resume exists and belongs to the user
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('fileUrl')
      .eq('id', req.params.id)
      .eq('userId', req.user!.id)
      .single();

    if (fetchError || !resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('resumes')
      .remove([resume.fileUrl]);

    if (storageError) throw storageError;

    // Delete resume record
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', req.params.id)
      .eq('userId', req.user!.id);

    if (error) throw error;

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting resume:', error);
    return res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;
