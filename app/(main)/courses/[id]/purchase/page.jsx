'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PurchaseForm } from './_components/purchase-form';
import { CourseInfo } from './_components/course-info';
import { PricingCard } from './_components/pricing-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CoursePurchasePage() {
  const { id: courseId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/courses/${courseId}/purchase`);
      return;
    }

    // Fetch course data
    const fetchCourse = async () => {
      try {
        // TODO: Replace with your actual course API
        const mockCourse = {
          id: courseId,
          title: 'Complete Web Development Course',
          description: 'Learn modern web development with React, Next.js, and more.',
          price: 99.99,
          currency: 'USD',
          instructor: 'John Doe',
          duration: '40 hours',
          thumbnail: '/api/placeholder/400/250',
          features: [
            '40+ hours of video content',
            'Source code included',
            'Certificate of completion',
            'Lifetime access',
            'Money-back guarantee'
          ]
        };
        setCourse(mockCourse);
      } catch (err) {
        setError('Failed to load course information');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchCourse();
    }
  }, [courseId, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course information...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error || 'Course not found'}</p>
            <Link href="/courses">
              <Button className="w-full">Back to Courses</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/courses/${courseId}`} className="text-blue-600 hover:text-blue-800">
            ← Back to Course Details
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Information */}
          <div className="space-y-6">
            <CourseInfo course={course} />
          </div>
          
          {/* Purchase Form */}
          <div className="space-y-6">
            <PricingCard course={course} />
            <PurchaseForm course={course} user={session.user} />
          </div>
        </div>
      </div>
    </div>
  );
}