import { migrateUsersToNewSchema } from "@/scripts/migrate-users";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Run migration
    const result = await migrateUsersToNewSchema();
    
    return NextResponse.json({
      success: true,
      message: "Migration completed successfully",
      result: result
    });
    
  } catch (error) {
    console.error("Migration API error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Migration failed",
      details: error.message
    }, { status: 500 });
  }
}

// For development only - you can call this endpoint to run migration
export async function GET() {
  return NextResponse.json({
    message: "Use POST method to run migration",
    endpoint: "/api/migrate-users",
    method: "POST"
  });
}