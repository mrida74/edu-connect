'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, BookOpen, Home, CreditCard } from 'lucide-react';
import { ReactPDFInvoice } from '@/components/ReactPDFInvoice';
import PaymentDetails from '@/components/PaymentDetails';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [userData, setUserData] = useState(null);
  
  const courseId = searchParams.get('courseId');
  const paymentIntentId = searchParams.get('paymentIntentId');
  const isFree = searchParams.get('free') === 'true';

  useEffect(() => {
    const processEnrollment = async () => {
      try {
        if (!courseId) {
          throw new Error('Course ID missing');
        }

        // Fetch course data
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        const course = await courseResponse.json();
        setCourseData(course);

        // Fetch user data (if user is logged in)
        try {
          const userResponse = await fetch('/api/auth/session');
          if (userResponse.ok) {
            const userSession = await userResponse.json();
            setUserData(userSession?.user);
          }
        } catch (userError) {
          console.log('User not logged in or session unavailable');
          // Set default user data for guest purchases
          setUserData({
            name: 'Guest User',
            email: 'guest@example.com'
          });
        }
        
      } catch (error) {
        console.error('Error processing enrollment:', error);
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };

    processEnrollment();
  }, [courseId, paymentIntentId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600">The course you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for enrolling in <span className="font-semibold">{courseData.title}</span>
          </p>
        </div>

        {/* Invoice Download Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Download className="w-5 h-5 text-blue-600" />
              <span>Download Your Invoice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                Get your professional PDF invoice for this purchase
              </p>
              <p className="text-sm text-gray-500">
                Invoice includes course details, payment information, and receipt
              </p>
            </div>
            
            {/* Invoice Download Button */}
            <ReactPDFInvoice 
              courseData={courseData}
              paymentData={{
                paymentIntentId: paymentIntentId,
                isFree: isFree
              }}
              userData={{
                name: userData?.name || 'Student',
                email: userData?.email || 'student@example.com',
                phone: userData?.phone
              }}
            />
          </CardContent>
        </Card>

        {/* Course Info Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {courseData.title}
              </h3>
              <p className="text-gray-600 mb-4">
                Your enrollment is confirmed and you can start learning immediately
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm font-medium mb-6">
                ✓ Successfully Enrolled
              </div>
              
              {/* Payment Details Section */}
              {paymentIntentId && (
                <div className="mb-6 text-left">
                  <div className="flex items-center mb-4">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    <h4 className="text-md font-semibold">Payment Information</h4>
                  </div>
                  <PaymentDetails paymentIntentId={paymentIntentId} />
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="space-y-3">
                <Link href="/account/enrolled-courses">
                  <Button className="w-full flex items-center justify-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>View My Enrolled Courses</span>
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <Home className="w-4 h-4" />
                    <span>Back to Home</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}