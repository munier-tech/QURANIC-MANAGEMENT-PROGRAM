import express from "express";
import { 
  createFeeRecord, 
  createClassFees, 
  getStudentsByClass, 
  getAllFeeRecords, 
  getStudentFeeRecords, 
  updateFeeRecord, 
  deleteFeeRecord, 
  getFeeStatistics 
} from "../controllers/feeController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

// Create fee record for individual student
router.post("/create", protectedRoute, createFeeRecord);

// Create fee records for all students in a class
router.post("/create-class", protectedRoute, createClassFees);

// Get students by class (with optional fee records)
router.get("/students/class/:classId", protectedRoute, getStudentsByClass);

// Get all fee records (with optional filters)
router.get("/getAll", protectedRoute, getAllFeeRecords);

// Get fee records for a specific student
router.get("/student/:studentId", protectedRoute, getStudentFeeRecords);

// Update fee record (mark as paid/unpaid, update note)
router.put("/update/:feeId", protectedRoute, updateFeeRecord);

// Delete fee record
router.delete("/delete/:feeId", protectedRoute, deleteFeeRecord);

// Get fee statistics
router.get("/statistics", protectedRoute, getFeeStatistics);

export default router;