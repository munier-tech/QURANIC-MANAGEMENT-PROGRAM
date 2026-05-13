import express from 'express';
import {
  recordAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getTeachersAttendanceByDate
} from '../controllers/teacherAttendanceController.js';
import { adminRoute, protectedRoute } from '../middlewares/authorization.js';

const router = express.Router();

router.post("/create" , protectedRoute, adminRoute, recordAttendance)
router.get("/get" , protectedRoute, adminRoute, getAttendance);
router.get("/get/:date" , protectedRoute, adminRoute, getTeachersAttendanceByDate);
router.put("/update" , protectedRoute, adminRoute, updateAttendance)
router.delete("/delete" , protectedRoute, adminRoute, deleteAttendance);

export default router;