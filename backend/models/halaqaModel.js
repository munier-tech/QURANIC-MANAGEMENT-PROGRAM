import mongoose from "mongoose";

const halaqaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  startingSurah: {
    type: String,
    default: ""
  },
  taxdiid: {
    type: String,
    default: ""
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Halaqa = mongoose.model("Halaqa", halaqaSchema);
export default Halaqa;