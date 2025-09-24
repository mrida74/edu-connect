'use client';
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { logIn } from "@/app/actions";
import { useState } from "react";
import { SocialLogin } from "@/components/social-login";

export function LoginForm() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get callbackUrl from URL parameters
  const callbackUrl = searchParams.get('callbackUrl') || '/courses';
  
  const handleSubmit = async (event)=> {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget)
      const response = await logIn(formData);
      
      if (response?.error) {
        setError(response.error.message || 'Login failed');
      } else if (response?.success) {
        // Redirect to callbackUrl or default to courses
        router.push(callbackUrl);
      } else {
        setError('Unexpected login response');
      }
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <p className="text-red-500">{error}</p>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
            </div>
            <Input id="password" type="password" name="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        
        {/* Social Login Component */}
        <SocialLogin callbackUrl={callbackUrl} />
        
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <p> 
            Register as a  {" "}
            <Link href="/register/student" className="underline">
             student
          </Link>
           {" "} or{" "}
          <Link href="/register/instructor" className="underline">
            instructor
          </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
