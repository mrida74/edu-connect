'use client';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You cancelled the payment process before it was completed. This is completely normal and happens sometimes.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Don&apos;t worry!</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• No payment was processed</li>
                <li>• Your card was not charged</li>
                <li>• You can try again anytime</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            {courseId && (
              <Link href={`/courses/${courseId}/purchase`}>
                <Button className="w-full sm:w-auto">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>
            )}
            
            <Link href={courseId ? `/courses/${courseId}` : '/courses'}>
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {courseId ? 'Back to Course' : 'Browse Courses'}
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Need help with your purchase?
            </p>
            <Link href="/support" className="text-blue-600 hover:underline text-sm">
              Contact our support team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}