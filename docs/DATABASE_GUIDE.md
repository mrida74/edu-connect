# 🗄️ Database Setup Guide

## MongoDB Configuration for EduConnect

### **📋 Overview**
EduConnect uses MongoDB for:
- 👤 **User Management** (NextAuth.js integration)
- 📚 **Course Data** (courses, modules, lessons)
- 📝 **Enrollments** (user course relationships)
- 💳 **Payment Records** (transaction history)

---

## **1. MongoDB Options**

### **Option A: Local MongoDB (Recommended for Development)**

**Install MongoDB:**
1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service

**Connection String:**
```env
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/edu-connect
```

### **Option B: MongoDB Atlas (Cloud)**

**Setup Steps:**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (Free tier: M0)
4. Create database user
5. Whitelist IP address (0.0.0.0/0 for development)
6. Get connection string

**Connection String:**
```env
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/edu-connect?retryWrites=true&w=majority
```

---

## **2. Database Schema**

### **Collections & Structure:**

#### **Users Collection (NextAuth.js)**
```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  image: "https://example.com/avatar.jpg",
  emailVerified: ISODate("2024-01-01T00:00:00Z"),
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}
```

#### **Accounts Collection (OAuth)**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  type: "oauth",
  provider: "google", // or "github"
  providerAccountId: "123456789",
  access_token: "...",
  token_type: "Bearer",
  scope: "...",
  createdAt: ISODate("2024-01-01T00:00:00Z")
}
```

#### **Sessions Collection**
```javascript
{
  _id: ObjectId("..."),
  sessionToken: "...",
  userId: ObjectId("..."),
  expires: ISODate("2024-01-01T00:00:00Z")
}
```

#### **Courses Collection**
```javascript
{
  _id: ObjectId("..."),
  title: "Complete Web Development Course",
  description: "Learn modern web development...",
  price: 99.99,
  currency: "USD",
  instructor: "John Doe",
  thumbnail: "/images/course-thumb.jpg",
  category: "Development",
  level: "Beginner",
  duration: "40 hours",
  features: ["Video Content", "Source Code", "Certificate"],
  modules: [ObjectId("..."), ObjectId("...")],
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  published: true
}
```

#### **Enrollments Collection**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  courseId: ObjectId("..."),
  enrolledAt: ISODate("2024-01-01T00:00:00Z"),
  progress: 0, // 0-100
  completed: false,
  paymentIntentId: "pi_1234567890", // Stripe payment ID
  amount: 99.99,
  currency: "USD"
}
```

---

## **3. Database Models**

### **User Model (Enhanced):**

**File: `models/user-model.js`**
```javascript
import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: String,
  emailVerified: Date,
  // Enhanced fields
  firstName: String,
  lastName: String,
  phone: String,
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  bio: String,
  enrollments: [{ type: Schema.Types.ObjectId, ref: 'Enrollment' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = models.User || model('User', userSchema);
```

### **Course Model:**

**File: `models/course-model.js`**
```javascript
import { Schema, model, models } from 'mongoose';

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  instructor: { type: String, required: true },
  thumbnail: String,
  category: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  duration: String,
  features: [String],
  modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Course = models.Course || model('Course', courseSchema);
```

### **Enrollment Model:**

**File: `models/enrollment-model.js`**
```javascript
import { Schema, model, models } from 'mongoose';

const enrollmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completed: { type: Boolean, default: false },
  // Payment information
  paymentIntentId: String, // Stripe payment intent ID
  amount: Number,
  currency: String,
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  }
});

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Enrollment = models.Enrollment || model('Enrollment', enrollmentSchema);
```

---

## **4. Database Connection**

### **MongoDB Connection Utility:**

**File: `lib/mongodb.js`**
```javascript
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_CONNECTION_STRING) {
  throw new Error('Please add your MongoDB connection string to .env.local');
}

const uri = process.env.MONGODB_CONNECTION_STRING;
const options = {};

let client;
let clientPromise;

// For NextAuth.js MongoDB adapter
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// For Mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export { clientPromise, connectDB };
```

---

## **5. Database Queries**

### **Course Queries:**

**File: `db/queries/courses.js`**
```javascript
import { connectDB } from '@/lib/mongodb';
import { Course } from '@/models/course-model';

export async function getCourseList() {
  await connectDB();
  
  const courses = await Course.find({ published: true })
    .select('title description price currency instructor thumbnail category level')
    .lean();
    
  return courses;
}

export async function getCourseById(courseId) {
  await connectDB();
  
  const course = await Course.findById(courseId).lean();
  return course;
}

export async function createCourse(courseData) {
  await connectDB();
  
  const course = new Course(courseData);
  await course.save();
  
  return course;
}
```

### **Enrollment Queries:**

**File: `db/queries/enrollments.js`**
```javascript
import { connectDB } from '@/lib/mongodb';
import { Enrollment } from '@/models/enrollment-model';

export async function createEnrollment(enrollmentData) {
  await connectDB();
  
  const enrollment = new Enrollment(enrollmentData);
  await enrollment.save();
  
  return enrollment;
}

export async function getUserEnrollments(userId) {
  await connectDB();
  
  const enrollments = await Enrollment.find({ userId })
    .populate('courseId', 'title description thumbnail instructor')
    .lean();
    
  return enrollments;
}

export async function checkEnrollment(userId, courseId) {
  await connectDB();
  
  const enrollment = await Enrollment.findOne({ userId, courseId }).lean();
  return !!enrollment;
}
```

---

## **6. Database Seeding**

### **Sample Data Script:**

**File: `scripts/seed-database.js`**
```javascript
import { connectDB } from '@/lib/mongodb';
import { Course } from '@/models/course-model';

const sampleCourses = [
  {
    title: "Complete Web Development Course",
    description: "Learn modern web development with React, Next.js, and more.",
    price: 99.99,
    currency: "USD",
    instructor: "John Doe",
    category: "Development",
    level: "Beginner",
    duration: "40 hours",
    features: [
      "40+ hours of video content",
      "Source code included", 
      "Certificate of completion",
      "Lifetime access"
    ],
    published: true
  },
  {
    title: "Advanced React Patterns",
    description: "Master advanced React patterns and best practices.",
    price: 149.99,
    currency: "USD", 
    instructor: "Jane Smith",
    category: "Development",
    level: "Advanced",
    duration: "25 hours",
    features: [
      "Advanced patterns",
      "Real-world projects",
      "Code reviews"
    ],
    published: true
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing courses
    await Course.deleteMany({});
    
    // Insert sample courses
    await Course.insertMany(sampleCourses);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
```

**Run seeding:**
```bash
node scripts/seed-database.js
```

---

## **7. Testing Database Connection**

### **Connection Test:**
```javascript
// Add to any page to test connection
import { connectDB } from '@/lib/mongodb';

export default async function TestPage() {
  let connectionStatus = 'Not tested';
  
  try {
    await connectDB();
    connectionStatus = 'Connected successfully!';
  } catch (error) {
    connectionStatus = `Connection failed: ${error.message}`;
  }
  
  return (
    <div>
      <h1>Database Connection Test</h1>
      <p>Status: {connectionStatus}</p>
    </div>
  );
}
```

---

## **8. Database Administration**

### **MongoDB Compass (GUI Tool):**
1. Download: https://www.mongodb.com/products/compass
2. Connect with your connection string
3. Browse collections and documents
4. Run queries and aggregations

### **MongoDB Shell Commands:**
```bash
# Connect to local MongoDB
mongosh mongodb://localhost:27017/edu-connect

# Show collections
show collections

# Find all users
db.users.find()

# Find all courses
db.courses.find()

# Count enrollments
db.enrollments.countDocuments()
```

---

## **✅ Database Setup Complete!**

Your MongoDB setup now includes:
- ✅ Connection configuration
- ✅ User authentication schema (NextAuth.js)
- ✅ Course and enrollment models
- ✅ Database queries
- ✅ Sample data seeding
- ✅ Connection testing

**Next Step:** Run `npm run dev` and test your application!