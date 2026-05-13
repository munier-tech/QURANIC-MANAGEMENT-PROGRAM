import express from "express";
import { protectedRoute } from "../middlewares/authorization.js";
import {
  createHalaqa,
  getAllHalaqas,
  getHalaqaByName,
  getHalaqaById,
  updateHalaqa,
  deleteHalaqa,
  addStudentsToHalaqa,
  removeStudentFromHalaqa,
} from "../controllers/halaqaController.js";

const router = express.Router();

router.post("/create", protectedRoute, createHalaqa);
router.get("/getAll", protectedRoute, getAllHalaqas);
router.get("/search", protectedRoute, getHalaqaByName);
router.get("/:id", protectedRoute, getHalaqaById);
router.put("/update/:id", protectedRoute, updateHalaqa);
router.delete("/delete/:id", protectedRoute, deleteHalaqa);

router.post("/:id/students", protectedRoute, addStudentsToHalaqa);
router.delete("/:id/students/:studentId", protectedRoute, removeStudentFromHalaqa);

export default router;