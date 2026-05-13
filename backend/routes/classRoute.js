import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignStudentToClass,
  getClassAttendance,
  getClassStudents,
  removeStudentFromClass,
  createMultipleClasses
} from "../controllers/classController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/create", protectedRoute ,createClass);
router.get("/getAll", protectedRoute ,getAllClasses);
router.get("/getId/:classId", protectedRoute ,getClassById);
router.put("/update/:classId", protectedRoute ,updateClass);
router.delete("/delete/:classId", protectedRoute ,deleteClass);
router.post("/:studentId/:classId", protectedRoute ,assignStudentToClass);
router.delete("/:studentId/:classId", protectedRoute ,removeStudentFromClass);
router.get("/getAttendance/:classId", protectedRoute , getClassAttendance);
router.post("/multiple", protectedRoute ,createMultipleClasses);
router.get("/getStudents/:classId", protectedRoute , getClassStudents);

export default router;
