import mongoose from "mongoose";

const disciplineSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [ "Wanaagsan", "Caadi", "xun", "aad u xun"],
      required: true,
    },
  },
  { timestamps: true }
);
const Discipline = mongoose.model("Discipline", disciplineSchema);

export default Discipline;
