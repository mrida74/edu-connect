import { NextResponse } from 'next/server';
import { dbConnect } from '@/services/mongo';
import { Enrollment } from '@/models/enrollment-model';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { 
      courseId, 
      userId, 
      paymentIntentId, 
      amount, 
      currency = 'usd',
      isFree = false 
    } = await request.json();

    // Validate required fields
    if (!courseId || !userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Course ID and User ID are required' 
      }, { status: 400 });
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      course_id: courseId,
      user_id: userId
    });

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled',
        enrollment: existingEnrollment
      });
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      user_id: userId,
      course_id: courseId,
      paymentIntentId: paymentIntentId || null,
      enrollment_date: new Date(),
      status: 'active',
      method: isFree ? 'free' : 'stripe'
    });

    return NextResponse.json({
      success: true,
      message: 'Enrollment created successfully',
      enrollment: enrollment
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}