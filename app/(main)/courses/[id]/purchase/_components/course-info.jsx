import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Award, Shield } from 'lucide-react';
import Image from 'next/image';

export function CourseInfo({ course }) {
  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card>
        <CardContent className="p-6">
          <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
            <Image
              src={`/assets/images/courses/${course?.thumbnail}`}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          {course.subtitle && (
            <h2 className="text-lg text-gray-600 mb-2">{course.subtitle}</h2>
          )}
          <p className="text-gray-600 mb-4">{course.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {course.instructor?.firstName} {course.instructor?.lastName}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.modules?.length || 0} modules
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            What You&apos;ll Get
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {course.learning?.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="ml-3 text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Security Badge */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Secure Payment</p>
              <p className="text-xs text-gray-500">SSL encrypted & PCI compliant</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}