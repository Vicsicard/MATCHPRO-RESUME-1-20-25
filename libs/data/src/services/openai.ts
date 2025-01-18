import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

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

  static async analyzeJobMatch(
    resumeText: string,
    jobDescription: string
  ): Promise<JobMatchAnalysis> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert job matching analyzer. Compare the candidate's resume with the job description and provide detailed analysis.
          Focus on: matching skills, missing requirements, and overall fit.
          Calculate a match score based on skills, experience, and qualifications.
          Provide specific recommendations for improving the match.`,
      },
      {
        role: 'user',
        content: `Resume: "${resumeText}"
          Job Description: "${jobDescription}"
          Please provide analysis in JSON format with the following structure:
          {
            "matchScore": number,
            "matchingSkills": string[],
            "missingSkills": string[],
            "recommendations": string[]
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
      console.error('Error analyzing job match:', error);
      throw error;
    }
  }

  static async generateCoverLetter(
    resumeText: string,
    jobDescription: string
  ): Promise<string> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert cover letter writer. Create a compelling cover letter that highlights the candidate's relevant experience and skills for the specific job.
          Focus on: matching the candidate's qualifications with job requirements, maintaining a professional tone, and showcasing enthusiasm for the role.`,
      },
      {
        role: 'user',
        content: `Resume: "${resumeText}"
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

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }

  static async improveResume(
    resumeText: string,
    targetJob: string
  ): Promise<string> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert resume writer. Improve the candidate's resume to better match their target job.
          Focus on: highlighting relevant experience, using impactful action verbs, quantifying achievements, and optimizing for ATS systems.`,
      },
      {
        role: 'user',
        content: `Resume: "${resumeText}"
          Target Job: "${targetJob}"
          Please provide an improved version of the resume with specific suggestions for enhancement.`,
      },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error improving resume:', error);
      throw error;
    }
  }
}
