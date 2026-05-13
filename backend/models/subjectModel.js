// models/subjectModel.js
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Subject", subjectSchema);
