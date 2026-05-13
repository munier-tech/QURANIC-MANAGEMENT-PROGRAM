import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      status: {
        type: String,
        enum: ["present", "absent", "late"],
        required: true,
      }
    }
  ]
}, { timestamps: true } , { _id : false });


const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;