import { InterviewSimulator } from '../components/InterviewSimulator';
import { ProtectedRoute } from '@matchpro/ui/src/components/Auth/ProtectedRoute';

export default function InterviewCoachPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Interview Coach
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Practice your interview skills with our AI-powered coach
            </p>
          </div>

          <InterviewSimulator />

          <div className="mt-12 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interview Tips
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-gray-900">Before the Interview</h3>
                <ul className="mt-2 text-gray-600 space-y-2">
                  <li>• Research the company thoroughly</li>
                  <li>• Review common interview questions</li>
                  <li>• Prepare your STAR method responses</li>
                  <li>• Test your camera and microphone</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">During the Interview</h3>
                <ul className="mt-2 text-gray-600 space-y-2">
                  <li>• Maintain good eye contact</li>
                  <li>• Listen carefully to questions</li>
                  <li>• Provide specific examples</li>
                  <li>• Show enthusiasm and interest</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
