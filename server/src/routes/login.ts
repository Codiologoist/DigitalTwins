import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

// Define the route for login
router.post("/login", login);

export default router;