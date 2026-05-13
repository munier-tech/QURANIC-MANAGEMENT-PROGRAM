import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: String,
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }],
  attendance: [ 
     {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendance"
   }
],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Class = mongoose.model("Class", classSchema);
export default Class;
