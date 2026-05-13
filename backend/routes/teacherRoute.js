import express from "express";
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher
} from "../controllers/teachersController.js";
import { protectedRoute } from "../middlewares/authorization.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// 👇 This supports file uploads (profilePicture, certificate)
router.post(
  "/create",
  protectedRoute,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "certificate", maxCount: 1 }
  ]),
  createTeacher
);

// Other routes
router.get("/get", protectedRoute, getAllTeachers);
router.get("/getId/:teacherId", protectedRoute, getTeacherById);
router.put(
  "/update/:teacherId",
  protectedRoute,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "certificate", maxCount: 1 }
  ]),
  updateTeacher
);
router.delete("/delete/:teacherId", protectedRoute, deleteTeacher);

export default router;
