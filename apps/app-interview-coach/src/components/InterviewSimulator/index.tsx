import React, { useState, useRef, useEffect } from 'react';
import { Button, Card } from '@matchpro/ui';
import { useAuth } from '@matchpro/ui/src/contexts/AuthContext';
import { OpenAIService, InterviewFeedback } from '@matchpro/data/src/services/openai';

interface Question {
  id: number;
  text: string;
  category: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "Tell me about yourself and your experience.",
    category: "Background",
  },
  {
    id: 2,
    text: "What are your greatest strengths and weaknesses?",
    category: "Personal Assessment",
  },
  {
    id: 3,
    text: "Why are you interested in this position?",
    category: "Motivation",
  },
  {
    id: 4,
    text: "Can you describe a challenging situation at work and how you handled it?",
    category: "Problem Solving",
  },
  {
    id: 5,
    text: "Where do you see yourself in five years?",
    category: "Career Goals",
  },
];

export function InterviewSimulator() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Select a random question
      const randomQuestion = sampleQuestions[
        Math.floor(Math.random() * sampleQuestions.length)
      ];
      setCurrentQuestion(randomQuestion);
      setFeedback(null);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsProcessing(true);

      // Convert recorded audio to text using a speech-to-text service
      // For now, we'll simulate the transcription
      const transcription = "This is a simulated transcription of the candidate's response.";

      try {
        // Get AI feedback
        const interviewFeedback = await OpenAIService.getInterviewFeedback(
          transcription,
          currentQuestion?.text || ''
        );
        setFeedback(interviewFeedback);
      } catch (error) {
        console.error('Error getting interview feedback:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleNewInterview = () => {
    setRecordedChunks([]);
    setFeedback(null);
    setCurrentQuestion(null);
  };

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            AI Interview Coach
          </h2>
          <p className="mt-2 text-gray-600">
            Practice your interview skills with our AI-powered coach
          </p>
        </div>

        {!isRecording && !feedback && !isProcessing && (
          <div className="text-center">
            <Button
              onClick={startRecording}
              className="w-full sm:w-auto"
            >
              Start Interview
            </Button>
          </div>
        )}

        {currentQuestion && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">
              Current Question:
            </h3>
            <p className="mt-2 text-blue-800">
              {currentQuestion.text}
            </p>
            <p className="mt-1 text-sm text-blue-600">
              Category: {currentQuestion.category}
            </p>
          </div>
        )}

        {isRecording && (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800">
                <span className="animate-pulse mr-2 h-3 w-3 rounded-full bg-red-600"></span>
                Recording...
              </div>
            </div>
            <Button
              onClick={stopRecording}
              variant="outlined"
              color="secondary"
              className="w-full sm:w-auto"
            >
              Stop Recording
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
              Analyzing your response...
            </div>
          </div>
        )}

        {feedback && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Interview Feedback
                </h3>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Score: {feedback.overallScore}/100
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strengths:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="text-green-700">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-red-700">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detailed Feedback:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {feedback.detailedFeedback}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleNewInterview}
                className="w-full sm:w-auto"
              >
                Start New Interview
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
