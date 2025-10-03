"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Shield, CheckCircle } from "lucide-react";

export default function PasswordSetup() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // Form states
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    currentPassword: ""
  });

  // Check if user is Google user without password
  const isGoogleUser = session?.user?.provider === "google";
  const hasPassword = session?.user?.hasPassword; // We'll need to add this to session

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePasswords = () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSetupPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validatePasswords()) return;

    setIsLoading(true);

    try {
      const endpoint = "/api/auth/setup-password";
      const method = isSettingNewPassword ? "POST" : "PUT";
      
      const requestBody = isSettingNewPassword 
        ? {
            password: formData.password,
            confirmPassword: formData.confirmPassword
          }
        : {
            currentPassword: formData.currentPassword,
            newPassword: formData.password,
            confirmPassword: formData.confirmPassword
          };

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({
          password: "",
          confirmPassword: "",
          currentPassword: ""
        });
        
        // Update session to reflect password status
        await update({
          ...session,
          user: {
            ...session.user,
            hasPassword: true
          }
        });
        
      } else {
        setError(data.error || "Failed to set password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Please login to access this feature.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Password Setup
          </CardTitle>
          <CardDescription>
            {isGoogleUser && !hasPassword 
              ? "Set up a password to enable email/password login in addition to Google"
              : hasPassword 
                ? "Change your existing password"
                : "Manage your login credentials"
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Password Status:</span>
            </div>
            <div className="flex items-center gap-1">
              {hasPassword ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Password Set</span>
                </>
              ) : (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                  <span className="text-sm text-gray-600">No Password</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {hasPassword ? "Change Password" : "Set New Password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetupPassword} className="space-y-4">
            
            {/* Current Password (only if changing existing password) */}
            {hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your current password"
                />
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                {hasPassword ? "New Password" : "Password"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter password (min 6 characters)"
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="border-green-200 text-green-800 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Setting up..." : hasPassword ? "Change Password" : "Set Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            <strong>Why set a password?</strong>
            <br />
            Setting a password allows you to login with your email and password if Google login is unavailable, 
            giving you multiple ways to access your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}