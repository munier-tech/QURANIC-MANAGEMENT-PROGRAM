import mongoose from "mongoose";


export const teachersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  number : {
    type: String,
    required: true,
    trim: true,
  },
  subject : {
    type: String,
    required: true,
    trim: true,
  },
  profilePicture : {
    type: String,
    required: false,
    trim: true,
  },
  attendance : {
    type: Number,
    ref: 'Attendance',
  },
  certificate : {
    type: String,
    required: false,
    trim: true,
  },
  salaryRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salary",
    },
  ]
}, {
  timestamps: true,
});


const Teachers = mongoose.model('Teachers', teachersSchema);

export default Teachers;