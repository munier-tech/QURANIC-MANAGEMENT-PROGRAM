import express from "express";
import { 
  createSalaryRecord, 
  createAllTeachersSalaries, 
  getAllSalaryRecords, 
  getTeacherSalaryRecords, 
  updateSalaryRecord, 
  deleteSalaryRecord, 
  getSalaryStatistics,
  getAllTeachers,
  markAllSalariesAsPaid
} from "../controllers/salaryController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

// Create salary record for individual teacher
router.post("/create", protectedRoute, createSalaryRecord);

// Create salary records for all teachers
router.post("/create-all", protectedRoute, createAllTeachersSalaries);

// Get all teachers (with optional salary records)
router.get("/teachers", protectedRoute, getAllTeachers);

// Get all salary records (with optional filters)
router.get("/getAll", protectedRoute, getAllSalaryRecords);

// Get salary records for a specific teacher
router.get("/teacher/:teacherId", protectedRoute, getTeacherSalaryRecords);

// Update salary record (mark as paid/unpaid, update amounts)
router.put("/update/:salaryId", protectedRoute, updateSalaryRecord);

// Delete salary record
router.delete("/delete/:salaryId", protectedRoute, deleteSalaryRecord);

// Get salary statistics
router.get("/statistics", protectedRoute, getSalaryStatistics);

// Mark all unpaid salaries as paid
router.put("/mark-all-paid", protectedRoute, markAllSalariesAsPaid);

export default router;