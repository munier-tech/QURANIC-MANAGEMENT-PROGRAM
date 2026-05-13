import express from "express"
import { createAttendance, deleteAttendance, getClassAttendanceByDate, updateAttendance } from "../controllers/attendanceController.js";
import { protectedRoute } from "../middlewares/authorization.js";
const router = express.Router();



router.post("/create", protectedRoute  , createAttendance);
router.get("/get/:classId/:date", protectedRoute,  getClassAttendanceByDate);
router.put("/update/:attendanceId", protectedRoute ,  updateAttendance);
router.delete("/delete/:attendanceId", protectedRoute , deleteAttendance);




export default router;