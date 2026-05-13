import express from "express";
import {
  AddFinance,
  getAllFinance,
  getFinanceById,
  getFinanceSummary,
  generateMonthlyFinance,
  getYearlyFinanceBreakdown,
} from "../controllers/financeController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/create", protectedRoute, AddFinance);
router.post("/generate-monthly", protectedRoute, generateMonthlyFinance);
router.get("/getAll", protectedRoute, getAllFinance);
router.get("/get/:financeId", protectedRoute, getFinanceById);
router.get("/summary", protectedRoute, getFinanceSummary);
router.get("/yearly-breakdown", protectedRoute, getYearlyFinanceBreakdown);

export default router;
