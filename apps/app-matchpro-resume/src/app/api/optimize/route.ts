'use server';

import { NextRequest, NextResponse } from 'next/server';
import { DocumentClient } from '@matchpro/data';
import OpenAIService from '@matchpro/data/services/openai';

export async function POST(req: NextRequest) {
  return new NextResponse(
    JSON.stringify({ error: 'This endpoint is temporarily unavailable' }),
    { status: 501 }
  );
}
