'use client';

import Link from 'next/link';
import { Button } from '@matchpro/ui';

export default function HomePage() {
  // Log environment variables (only public ones)
  console.log('Environment check:', {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Land Your Dream Job with{' '}
            <span className="text-blue-500">AI-Optimized Resumes</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Upload your resume, provide the job posting, and let our AI technology tailor your
            qualifications to perfectly match the position requirements.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
          <div className="flex justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="text-green-500 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>ATS-Friendly</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="text-green-500 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>GDPR-Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="text-green-500 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>256-bit Encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MatchPro Resume?</h2>
            <p className="text-xl text-gray-600">Unlock your career potential with our cutting-edge features</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ATS Optimization */}
            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 -mt-4 mr-4 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center transform -rotate-12">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart ATS Optimization</h3>
              <p className="text-gray-600 mb-4">Our AI-powered system analyzes job descriptions and optimizes your resume to pass Applicant Tracking Systems with ease.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Keyword optimization
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Format compatibility
                </li>
              </ul>
            </div>

            {/* Real-time Analysis */}
            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 -mt-4 mr-4 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center transform -rotate-12">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analysis</h3>
              <p className="text-gray-600 mb-4">Get instant feedback and suggestions to improve your resume's impact and effectiveness.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Instant feedback
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Content scoring
                </li>
              </ul>
            </div>

            {/* Professional Templates */}
            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 -mt-4 mr-4 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center transform -rotate-12">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Templates</h3>
              <p className="text-gray-600 mb-4">Choose from our collection of professionally designed templates that stand out and get noticed.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Modern designs
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Industry-specific layouts
                </li>
              </ul>
            </div>

            {/* Industry Insights */}
            <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 -mt-4 mr-4 w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center transform -rotate-12">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Industry Insights</h3>
              <p className="text-gray-600 mb-4">Get tailored recommendations based on your industry and career goals.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Sector-specific tips
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Trending skills
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to boost your career?</h2>
          <p className="text-xl mb-4">Start optimizing your resume today.</p>
          <p className="text-lg mb-8">
            Join thousands of successful job seekers who have improved their chances with MatchPro Resume.
          </p>
          <Link href="/signup">
            <Button variant="secondary" size="lg">
              Upload Your Resume →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
