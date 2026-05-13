import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  paidDate: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    required: true
  },
  note: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Index for efficient querying
feeSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });
feeSchema.index({ class: 1, month: 1, year: 1 });

const Fee = mongoose.model('Fee', feeSchema);

export default Fee;