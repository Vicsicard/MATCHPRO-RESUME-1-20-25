import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
}

export interface JobMatchAnalysis {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export interface OptimizeResumeParams {
  resumeContent: string;
  jobDescription: string;
}

export interface AnalyzeJobMatchParams {
  resumeContent: string;
  jobDescription: string;
}

export interface GenerateCoverLetterParams {
  resumeContent: string;
  jobDescription: string;
}

export class OpenAIService {
  static async getInterviewFeedback(
    transcription: string,
    question: string
  ): Promise<InterviewFeedback> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert interview coach. Analyze the candidate's response to interview questions and provide detailed feedback.
          Focus on: clarity of communication, relevance to the question, structure of the response, and specific examples provided.
          Provide a score out of 100, key strengths, areas for improvement, and detailed feedback.`,
      },
      {
        role: 'user',
        content: `Question: "${question}"
          Candidate's Response: "${transcription}"
          Please provide feedback in JSON format with the following structure:
          {
            "overallScore": number,
            "strengths": string[],
            "improvements": string[],
            "detailedFeedback": string
          }`,
      },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error getting interview feedback:', error);
      throw error;
    }
  }

  static async generateCoverLetter({
    resumeContent,
    jobDescription,
  }: GenerateCoverLetterParams): Promise<string> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert cover letter writer. Create a compelling cover letter that highlights the candidate's relevant experience and skills for the specific job.
          Focus on: matching the candidate's qualifications with job requirements, maintaining a professional tone, and showcasing enthusiasm for the role.`,
      },
      {
        role: 'user',
        content: `Resume: "${resumeContent}"
          Job Description: "${jobDescription}"
          Please generate a professional cover letter that connects the candidate's experience with the job requirements.`,
      },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }

  static async optimizeResume({
    resumeContent,
    jobDescription,
  }: OptimizeResumeParams): Promise<string> {
    const prompt = `
      As an expert resume optimizer, analyze the following resume content and job description.
      Provide specific suggestions to optimize the resume for this job, focusing on:
      1. Relevant skills and experience alignment
      2. Key achievements and metrics
      3. Industry-specific terminology
      4. Action verbs and impactful language

      Resume Content:
      ${resumeContent}

      Job Description:
      ${jobDescription}

      Please provide the optimized resume content.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  static async analyzeJobMatch({
    resumeContent,
    jobDescription,
  }: AnalyzeJobMatchParams): Promise<string> {
    const prompt = `
      As an expert job match analyzer, compare the following resume content with the job description.
      Provide a detailed analysis of:
      1. Skills match percentage
      2. Experience alignment
      3. Missing key requirements
      4. Recommendations for improvement

      Resume Content:
      ${resumeContent}

      Job Description:
      ${jobDescription}

      Please provide a detailed analysis.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || '';
  }
}

export { OpenAIService as default };
