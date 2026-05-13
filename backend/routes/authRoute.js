import express from "express"
import {  deleteUser, getAllUser, LogOut, SignIn, SignUp, updateUser, WhoAmI } from "../controllers/authController.js";
import { protectedRoute } from "../middlewares/authorization.js";
const router = express.Router();




router.post("/signUp", SignUp)
router.post("/login", SignIn)
router.post("/logout",protectedRoute ,  LogOut)
router.get("/",protectedRoute ,  getAllUser)
router.put("/update/:userId",protectedRoute ,  updateUser)
router.delete("/delete/:userId",protectedRoute ,  deleteUser)
router.get("/WhoAmI", protectedRoute , WhoAmI)




export default router;