import { Router } from "express";
import {
  createAdmin,
  getAllDoctors,
  getDoctorBySSN,
  createDoctor,
  deleteDoctor,
  updateDoctor,
} from "../controllers/adminController";

const router = Router();

// Admin routes for managing doctors
router.post("/", createAdmin); // CREATE a new admin
router.get("/doctors", getAllDoctors); // GET all doctors
router.get("/doctors/:SSN", getDoctorBySSN); // Get a specific doctor by SSN
router.post("/doctors", createDoctor); // CREATE a new doctor
router.delete("/doctors/:SSN", deleteDoctor); // DELETE a doctor by SSN
router.patch("/doctors/:SSN", updateDoctor); // UPDATE a doctor by SSN

export default router;
