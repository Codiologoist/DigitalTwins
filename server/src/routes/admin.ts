import { Router } from "express";
import {
  getAllDoctors,
  createDoctor,
  deleteDoctor,
  updateDoctor,
} from "../controllers/adminController";

const router = Router();

// Admin routes for managing doctors
router.get("/doctors", getAllDoctors); // GET all doctors
router.post("/doctors", createDoctor); // CREATE a new doctor
router.delete("/doctors/:SSN", deleteDoctor); // DELETE a doctor by SSN
router.patch("/doctors/:SSN", updateDoctor); // UPDATE a doctor by SSN

export default router;
