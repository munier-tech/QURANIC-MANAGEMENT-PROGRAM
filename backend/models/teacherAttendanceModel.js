// models/TeacherAttendance.js
import mongoose from 'mongoose';

const TeacherAttendanceSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teachers',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'on_leave'],
    required: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  notes: {
    type: String
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const TeacherAttendance = mongoose.model('TeacherAttendance', TeacherAttendanceSchema);
export default TeacherAttendance;