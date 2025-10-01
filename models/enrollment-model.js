import mongoose , { Schema } from "mongoose";

const enrollmentSchema = new Schema({
  user_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  course_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  paymentIntentId: {
    type: String,
    required: false,
  },
  enrollment_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
  completion_date: {
    type: Date,
  },
  method : {
    type: String,
    required: true,
  },
});

const Enrollment =  mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

export {Enrollment};
