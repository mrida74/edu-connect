import { User } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";

// Migration script to update existing users to new schema
export async function migrateUsersToNewSchema() {
  try {
    await dbConnect();
    console.log("Starting user migration...");

    // 1. Migrate Google users: name → firstName/lastName, image → profilePicture
    const googleUsers = await User.find({
      name: { $exists: true },
      firstName: { $exists: false }
    });

    console.log(`Found ${googleUsers.length} Google users to migrate`);

    for (const user of googleUsers) {
      const nameParts = user.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            role: user.role || "student",
            provider: "google",
            profilePicture: user.image || "/assets/images/profile.jpg",
            emailVerified: user.emailVerified || new Date()
          },
          $unset: {
            name: 1,    // Remove old name field
            image: 1    // Remove old image field (if exists)
          }
        }
      );

      console.log(`Migrated Google user: ${firstName} ${lastName}`);
    }

    // 2. Update Credentials users: add missing fields
    const credentialUsers = await User.find({
      $or: [
        { provider: { $exists: false } },
        { profilePicture: { $exists: false } }
      ],
      firstName: { $exists: true }  // Only credentials users have firstName already
    });

    console.log(`Found ${credentialUsers.length} credentials users to update`);

    for (const user of credentialUsers) {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            provider: user.provider || "credentials",
            profilePicture: user.profilePicture || "/assets/images/profile.jpg",
            role: user.role || "student"
          }
        }
      );

      console.log(`Updated credentials user: ${user.firstName} ${user.lastName}`);
    }

    console.log("Migration completed successfully!");
    return {
      googleUsersMigrated: googleUsers.length,
      credentialUsersUpdated: credentialUsers.length
    };

  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
}

// Run migration (call this function when needed)
export async function runMigration() {
  try {
    const result = await migrateUsersToNewSchema();
    console.log("Migration result:", result);
  } catch (error) {
    console.error("Failed to run migration:", error);
  }
}