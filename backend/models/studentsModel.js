import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    unique: true,
    index: true,
    sparse: true,
  },
  age: Number,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Class",
  },
  fee: {
  total: {
     type: Number,
     default: 0
   },
  paid: { 
    type: Number,
    default: 0
   }
  },
   motherNumber: {
    type: String,
    required: true,
  },
  fatherNumber: {
    type: String,
    required: true,
  },
  healthRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Health",
    },
  ],
  examRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
  disciplineReports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discipline",
    },
  ],
  feeRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fee",
    },
  ],
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate a human-friendly unique ID like "STD-2025-123456"
async function generateUniqueStudentId(doc) {
  const year = new Date().getFullYear();
  const prefix = `STD-${year}-`;

  // Try a few times to avoid unlikely collisions
  for (let attempt = 0; attempt < 5; attempt++) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    const candidate = `${prefix}${randomSixDigits}`;
    const exists = await doc.constructor.exists({ studentId: candidate });
    if (!exists) return candidate;
  }

  // Fallback to ObjectId suffix to guarantee uniqueness
  const fallback = `${prefix}${new mongoose.Types.ObjectId().toString().slice(-6).toUpperCase()}`;
  return fallback;
}

studentSchema.pre("save", async function (next) {
  try {
    if (this.isNew && !this.studentId) {
      this.studentId = await generateUniqueStudentId(this);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
