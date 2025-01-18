import express, { Router } from 'express';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';
import { UserProfileSchema } from '../types';

const router: Router = express.Router();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Get user profile
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user!.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update user profile
router.put('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const profileData = UserProfileSchema.parse({
      ...req.body,
      id: req.user!.id,
      email: req.user!.email,
      updatedAt: new Date().toISOString(),
    });

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', req.user!.id)
      .single();

    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', req.user!.id)
        .select()
        .single();
    } else {
      // Create new profile
      result = await supabase
        .from('user_profiles')
        .insert([{ ...profileData, createdAt: new Date().toISOString() }])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return res.json(result.data);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    } else {
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  }
});

// Add experience
router.post('/experience', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const experienceSchema = UserProfileSchema.shape.experience.element;
    const experienceData = experienceSchema.parse(req.body);

    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('experience')
      .eq('id', req.user!.id)
      .single();

    if (fetchError) throw fetchError;

    const experience = profile?.experience || [];
    experience.push(experienceData);

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ experience, updatedAt: new Date().toISOString() })
      .eq('id', req.user!.id)
      .select()
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error('Error adding experience:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    } else {
      return res.status(500).json({ error: 'Failed to add experience' });
    }
  }
});

// Add education
router.post('/education', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const educationSchema = UserProfileSchema.shape.education.element;
    const educationData = educationSchema.parse(req.body);

    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('education')
      .eq('id', req.user!.id)
      .single();

    if (fetchError) throw fetchError;

    const education = profile?.education || [];
    education.push(educationData);

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ education, updatedAt: new Date().toISOString() })
      .eq('id', req.user!.id)
      .select()
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error('Error adding education:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    } else {
      return res.status(500).json({ error: 'Failed to add education' });
    }
  }
});

// Update skills
router.put('/skills', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const skills = z.array(z.string()).parse(req.body.skills);

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ skills, updatedAt: new Date().toISOString() })
      .eq('id', req.user!.id)
      .select()
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error('Error updating skills:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    } else {
      return res.status(500).json({ error: 'Failed to update skills' });
    }
  }
});

export default router;
