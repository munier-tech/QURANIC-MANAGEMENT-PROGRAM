import mongoose from "mongoose";

const familyFeeSchema = new mongoose.Schema({
  familyName: {
    type: String,
    required: true,
    trim: true
  },
  students: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    isPaying: {
      type: Boolean,
      default: false // true if this student pays, false if covered by family
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
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
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'other'],
    default: 'cash'
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
familyFeeSchema.index({ familyName: 1, month: 1, year: 1 });
familyFeeSchema.index({ 'students.student': 1 });

const FamilyFee = mongoose.model('FamilyFee', familyFeeSchema);

export default FamilyFee;