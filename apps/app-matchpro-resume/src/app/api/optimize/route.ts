'use server';

import { NextRequest, NextResponse } from 'next/server';
import { DocumentService, OpenAIService } from '@matchpro/data';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string;
    
    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await DocumentService.extractTextFromDocument(buffer, file.name);
    
    const optimizedContent = await OpenAIService.optimizeResume({
      resumeContent: resumeText,
      jobDescription,
    });

    const matchAnalysis = await OpenAIService.analyzeJobMatch({
      resumeContent: optimizedContent,
      jobDescription,
    });

    return NextResponse.json({
      optimizedContent,
      matchAnalysis,
    });
  } catch (error) {
    console.error('Error in resume optimization:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}
