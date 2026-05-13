import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teachers',
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
  bonus: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
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

// Calculate total amount before saving
salarySchema.pre('save', function(next) {
  this.totalAmount = this.amount + this.bonus - this.deductions;
  next();
});

// Index for efficient querying
salarySchema.index({ teacher: 1, month: 1, year: 1 }, { unique: true });

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;