import express from "express";
import {
  createExam,
  updateExam,
  deleteExam,
  getExamsByClassAndYear,
  getStudentExamsByYear,
  createClassExam
} from "../controllers/examController.js";

import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/create", protectedRoute, createExam);
router.post("/createClassExam", protectedRoute ,createClassExam);
router.post("/student", protectedRoute, getStudentExamsByYear);
router.post("/classExams", protectedRoute, getExamsByClassAndYear);
router.patch("/update/:examId", protectedRoute, updateExam);
router.delete("/delete/:examId", protectedRoute, deleteExam);

export default router;
