import { User } from "@/models/user-model";
import {NextResponse ,NextRequest } from "next/server";
import { dbConnect } from "@/services/mongo";
import bcrypt from "bcryptjs";      

export async function POST(req) {
  const { email, password, firstName, lastName, userRole } = await req.json();
    await dbConnect();
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create a new user
  const newuser = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: userRole,
  }

  try {
    await User.create(newuser);
    console.log(newuser);
    return NextResponse.json({ message: "User registered successfully"}, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return NextResponse.json({ error: "User registration failed"}, { status: 500 });
  }
}
