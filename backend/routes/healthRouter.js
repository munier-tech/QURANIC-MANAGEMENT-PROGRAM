import express from "express";
import { addHealthRecord, deleteHealthRecord, getAllHealthRecords, getStudentHealthRecords, updateHealthRecord } from "../controllers/healthController.js";
import { protectedRoute } from "../middlewares/authorization.js";
const router = express.Router();


router.post("/create" , protectedRoute , addHealthRecord);
router.get("/getAll" , protectedRoute , getAllHealthRecords);
router.get("/getStudent/:studentId" , protectedRoute , getStudentHealthRecords);
router.put("/update/:healthId", protectedRoute, updateHealthRecord);
router.delete("/delete/:healthId", protectedRoute, deleteHealthRecord);




export default router;