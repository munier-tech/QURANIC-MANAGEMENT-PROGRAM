import mongoose from "mongoose";




const healthSchema = new mongoose.Schema({
  student : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Student',
    required: true
  },
  date : {
    type : Date,
    required : true,
    default: Date.now
  },
  condition : {
    type : String,
    required: true
  },
  treated : {
    type : Boolean,
    required: true
  },
  note : {
    type : String,
    required: false
  }
} , { timestamps: true });

const Health = mongoose.model('Health', healthSchema);

export default Health;