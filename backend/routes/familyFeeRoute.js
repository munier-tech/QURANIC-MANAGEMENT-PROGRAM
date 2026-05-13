import express from "express";
import { 
  createFamilyFee, 
  getAllFamilyFees, 
  getFamilyFeeById, 
  updateFamilyFee, 
  processFamilyFeePayment, 
  deleteFamilyFee, 
  getFamilyFeeStatistics 
} from "../controllers/familyFeeController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

// Create family fee record
router.post("/create", protectedRoute, createFamilyFee);

// Get all family fee records (with optional filters)
router.get("/getAll", protectedRoute, getAllFamilyFees);

// Get family fee by ID
router.get("/:id", protectedRoute, getFamilyFeeById);

// Update family fee record
router.put("/update/:id", protectedRoute, updateFamilyFee);

// Process family fee payment
router.put("/payment/:id", protectedRoute, processFamilyFeePayment);

// Delete family fee record
router.delete("/delete/:id", protectedRoute, deleteFamilyFee);

// Get family fee statistics
router.get("/statistics", protectedRoute, getFamilyFeeStatistics);

export default router;