import { User } from "@/models/user-model";
import { NextResponse } from "next/server";
import { dbConnect } from "@/services/mongo";
import bcrypt from "bcryptjs";      

export async function POST(req) {
  try {
    const { email, password, firstName, lastName, userRole = "student" } = await req.json();
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required" }, 
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" }, 
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with consistent structure
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole,
      profilePicture: "/assets/images/profile.jpg",  // Default profile picture
      provider: "credentials",                        // Mark as credentials user
      emailVerified: null,                           // Will be verified later
      hasPassword: true                              // Mark that user has password
    };

    const createdUser = await User.create(newUser);
    
    console.log("User created:", {
      id: createdUser._id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      role: createdUser.role,
      provider: createdUser.provider
    });

    return NextResponse.json(
      { 
        message: "User registered successfully",
        user: {
          id: createdUser._id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email,
          role: createdUser.role
        }
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering user:", error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User already exists with this email" }, 
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "User registration failed" }, 
      { status: 500 }
    );
  }
}
