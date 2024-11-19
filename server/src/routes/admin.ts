import { Router } from "express";
import {
  createAdmin,
  getAllDoctors,
  getDoctorById,
  createDoctor,
  deleteDoctor,
  updateDoctor,
} from "../controllers/adminController";

const router = Router();

// Admin routes for managing doctors
router.post("/", createAdmin); // CREATE a new admin
router.get("/doctors", getAllDoctors); // GET all doctors
router.get("/doctors/:id", getDoctorById); // Get a specific doctor by id
router.post("/doctors", createDoctor); // CREATE a new doctor
router.delete("/doctors/:id", deleteDoctor); // DELETE a doctor by id
router.patch("/doctors/:id", updateDoctor); // UPDATE a doctor by id

export default router;
