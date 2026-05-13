import mongoose from "mongoose";

const dailyQuranSession = new mongoose.Schema({
   student : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
   },
   status : {
     type: String,
     enum: ["gartay", "garan waayay", "majoogo"],
     default: "majoogo",
     required: true,
   },
   date : {
    type: Date,
    default: Date.now,
   },
   class : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
   },
   currentSurah: {
     type: String,
     default: "",
   },
   taxdiid: {
     type: String,
     default: "",
   },
   notes: {
     type: String,
     default: "",
   }
} , { timestamps : true} )


const DailyQuran = mongoose.model("DailyQuran", dailyQuranSession);

export default DailyQuran;