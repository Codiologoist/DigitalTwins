import { Router } from 'express';
import { sendPatientData, sendPatientCategoryData, 
    createPatient, getAllPatients, deletePatient} from '../controllers/patientController';

const router = Router();

// Define the route of sending patient data(all categories) by patient id
router.get('/:SSN/data', sendPatientData);

// Define the route of sending patient category data by patient id
router.get('/:SSN/data/:category', sendPatientCategoryData);

// Define the route for creation of a new patient
router.post('/', createPatient);

// Define a route for getting all patients
router.get('/', getAllPatients);

// Define a route for deleting a patient
router.delete('/:SSN', deletePatient);

export default router;