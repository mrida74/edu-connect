'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Download, Award } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  
  const courseId = searchParams.get('courseId');
  const paymentIntentId = searchParams.get('paymentIntentId');
  const isFree = searchParams.get('free') === 'true';

  useEffect(() => {
    // TODO: Verify payment and enroll user in course
    const processEnrollment = async () => {
      try {
        if (!courseId) {
          throw new Error('Course ID missing');
        }

        // Mock course data - replace with actual API call
        const mockCourse = {
          id: courseId,
          title: 'Complete Web Development Course',
          instructor: 'John Doe',
          thumbnail: '/api/placeholder/400/250'
        };
        
        setCourseData(mockCourse);
        
        // TODO: Call your enrollment API
        console.log('Enrolling user in course:', courseId);
        console.log('Payment Intent ID:', paymentIntentId);
        
      } catch (error) {
        console.error('Enrollment error:', error);
        // TODO: Handle enrollment failure
      } finally {
        setLoading(false);
      }
    };

    processEnrollment();
  }, [courseId, paymentIntentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your enrollment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isFree ? 'Enrollment Successful!' : 'Payment Successful!'}
          </h1>
          <p className="text-gray-600">
            {isFree 
              ? 'You have been enrolled in the course'
              : 'Thank you for your purchase. You now have access to the course.'
            }
          </p>
        </div>

        {courseData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{courseData.title}</h3>
                  <p className="text-gray-600">by {courseData.instructor}</p>
                  {paymentIntentId && (
                    <p className="text-sm text-gray-500 mt-2">
                      Transaction ID: {paymentIntentId}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Start Learning</h3>
              <p className="text-sm text-gray-600 mb-4">
                Access your course content immediately
              </p>
              <Link href={`/courses/${courseId}`}>
                <Button className="w-full">Go to Course</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Download Resources</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get access to course materials and resources
              </p>
              <Button variant="outline" className="w-full">
                Download
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Certificate</h3>
              <p className="text-sm text-gray-600 mb-4">
                Earn your certificate upon completion
              </p>
              <Button variant="outline" className="w-full">
                View Progress
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline">Browse More Courses</Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            Questions? <Link href="/support" className="text-blue-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}