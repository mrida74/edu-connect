"use server";

import { signIn } from "@/auth";

export async function logIn(formData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    
    // Check if login was successful
    if (response?.error) {
      return { error: response.error };
    }
    
    return { success: true };
  } catch (error) {
    return { error: { message: error.message } };
  }
}