import express from "express";
import {
  createDiscipline,
  getAllDisciplineRecords,
  getDisciplineById,
  updateDiscipline,
  deleteDiscipline,
} from "../controllers/disciplineController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/create", protectedRoute ,createDiscipline);
router.get("/getAll", protectedRoute ,  getAllDisciplineRecords);
router.get("/:id", protectedRoute ,  getDisciplineById);
router.put("/:id", protectedRoute ,  updateDiscipline);
router.delete("/:id", protectedRoute ,  deleteDiscipline);

export default router;
