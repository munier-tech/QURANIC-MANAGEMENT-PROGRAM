import express from "express";
import { 
  createDailyQuran, 
  updateDailyQuran, 
  getTodaySessions, 
  createBulkSessions,
  getStudentSessions,
  deleteDailyQuran,
  getClassSessionsByDate,
  getClassSessions // ADD THIS IMPORT
} from "../controllers/dailyQuranController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

// Create a single daily Quran session
router.post("/create", protectedRoute, createDailyQuran);

// Create bulk sessions for multiple students
router.post("/create/bulk", protectedRoute, createBulkSessions);

// Get today's sessions for a class
router.get("/today/:classId", protectedRoute, getTodaySessions);

// ✅ NEW: Get sessions for a specific class and date
router.get("/class/:classId/date/:date", protectedRoute, getClassSessionsByDate);

// Get all sessions for a class (with optional date filtering)
router.get("/class/:classId", protectedRoute, getClassSessions);

// Get all sessions for a student
router.get("/student/:studentId", protectedRoute, getStudentSessions);

// Update daily Quran session
router.put("/update/:id", protectedRoute, updateDailyQuran);

// Delete daily Quran session
router.delete("/delete/:id", protectedRoute, deleteDailyQuran);

export default router;