import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/create", protectedRoute, createSubject);
router.get("/", getAllSubjects);
router.get("/:subjectId", getSubjectById);
router.put("/update/:subjectId", protectedRoute, updateSubject);
router.delete("/delete/:subjectId", protectedRoute, deleteSubject);

export default router;
