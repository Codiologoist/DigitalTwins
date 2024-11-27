import { Router } from "express";
import {saveDecryptedData } from "../controllers/decryptedDataController";

const router = Router();

// Route to trigger saving of decrypted data
router.post("/save-decrypted-data/:SSN", saveDecryptedData);

export default router;
