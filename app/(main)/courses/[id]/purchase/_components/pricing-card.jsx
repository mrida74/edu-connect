import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/formatPrice';
import { Tag, Zap, RotateCcw } from 'lucide-react';

export function PricingCard({ course }) {
  const originalPrice = course.price * 1.3; // Mock original price for discount effect
  const discount = Math.round(((originalPrice - course.price) / originalPrice) * 100);

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-blue-600" />
            Course Price
          </span>
          {discount > 0 && (
            <Badge variant="destructive" className="bg-red-500">
              {discount}% OFF
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {discount > 0 && (
            <p className="text-lg text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </p>
          )}
          <p className="text-3xl font-bold text-gray-900">
            {formatPrice(course.price)}
          </p>
          <p className="text-sm text-gray-500">One-time payment</p>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Zap className="h-4 w-4 mr-2 text-green-500" />
            Instant access after payment
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <RotateCcw className="h-4 w-4 mr-2 text-blue-500" />
            30-day money-back guarantee
          </div>
        </div>

        {course.price === 0 && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium">🎉 This course is free!</p>
            <p className="text-green-600 text-sm">Click below to enroll</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}