import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: false,  // Optional for Google users
    type: String,
  },
  role: {
    required: true,
    type: String,
    default: "student",
  },
  profilePicture: {
    required: false,
    type: String,
    default: "/assets/images/profile.jpg",
  },
  provider: {
    required: false,
    type: String,
    default: "credentials",
  },
  emailVerified: {
    required: false,
    type: Date,
    default: null,
  },
  phone: {
    required: false,
    type: String,
  },
  bio: {
    required: false,
    type: String,
  },
  socialMedia: {
    required: false,
    type: Object,
  },
  hasPassword: {
    required: false,
    type: Boolean,
    default: false, // Track if user has set a password
  },
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };
