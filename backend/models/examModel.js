import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: [true, "Student reference is required"]
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: [true, "Class reference is required"]
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",
    required: [true, "Teacher reference is required"]
  },
  subjectId: {  // ✅ renamed from subjectId → subject for consistency
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: [true, "Subject reference is required"]
  },
  examType: {
    type: String,
    enum: {
      values: ["mid-term", "final", "quiz", "assignment"],
      message: "Exam type must be one of: mid-term, final, quiz, assignment"
    },
    required: [true, "Exam type is required"]
  },
  date: {
    type: Date,
    required: [true, "Exam date is required"]
  },
  obtainedMarks: {  // ✅ clearer naming than just "marks"
    type: Number,
    required: [true, "Obtained marks are required"],
    min: [0, "Obtained marks cannot be negative"]
  },
  totalMarks: {
    type: Number,
    required: [true, "Total marks are required"],
    min: [1, "Total marks must be at least 1"]
  },
  academicYear: {
    type: String,
    required: [true, "Academic year is required"],
    match: [/^\d{4}\/\d{4}$/, "Academic year must be in the format YYYY/YYYY"]
  }
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
