import express from "express";
import { protectedRoute } from "../middlewares/authorization.js";
import { createQuranRecord, createSubcisRecord, getRecordsByHalaqa, deleteRecord, getQuranRecordsByClassAndMonth, updateRecord } from "../controllers/lessonRecordController.js";

const router = express.Router();

// Qur'aan (class-based)
router.post("/quran", protectedRoute, createQuranRecord);
router.get("/quran/class/:classId", protectedRoute, getQuranRecordsByClassAndMonth);

// Subci (halaqa-based)
router.post("/subcis", protectedRoute, createSubcisRecord);
router.get("/halaqa/:halaqaId", protectedRoute, getRecordsByHalaqa);

// Common
router.put("/update/:id", protectedRoute, updateRecord);
router.delete("/delete/:id", protectedRoute, deleteRecord);

export default router;