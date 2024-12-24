import { Router } from 'express';
import { sendPatientData, sendPatientCategoryData, 
    createPatient, getAllPatients, deletePatient, updatePatient, getOnePatient} from '../controllers/patientController';

const router = Router();

// Define the route of sending patient data(all categories) by patient id
router.get('/:SSN/data', sendPatientData);

router.get('/:SSN', getOnePatient);

// Define the route of sending patient category data by patient id
router.get('/:SSN/data/:category', sendPatientCategoryData);

// Define the route for creation of a new patient
router.post('/', createPatient);

// Define a route for getting all patients
router.get('/', getAllPatients);

// Define a route for deleting a patient
router.delete('/:SSN', deletePatient);

router.patch('/:SSN', updatePatient);

export default router;