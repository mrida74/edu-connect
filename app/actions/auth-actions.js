'use server'

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { User } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function setupPasswordAction(formData) {
  try {
    // Get session
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized. Please login first.");
    }

    // Get form data
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validation
    if (!password || !confirmPassword) {
      throw new Error("Password and confirm password are required");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Connect to database
    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user already has a password
    if (user.password) {
      throw new Error("You already have a password set. Use the change password option instead.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user with password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      hasPassword: true,
      updatedAt: new Date()
    });

    // Comprehensive revalidation to update session
    revalidatePath('/', 'layout'); // Revalidate entire app layout
    revalidatePath('/courses'); // Revalidate courses page
    revalidatePath('/auth/complete-setup'); // Revalidate setup page
    
    // Add a small delay to ensure database transaction completes
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Redirect to courses
    redirect('/courses');

  } catch (error) {
    // Return error for client-side handling
    throw error;
  }
}