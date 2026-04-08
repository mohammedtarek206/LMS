const express = require('express');
const { getPatients, addPatient, getPatientById, updatePatient, deletePatient, searchPatients } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getPatients).post(protect, addPatient);
router.get('/search', protect, searchPatients);

router
  .route('/:id')
  .get(protect, getPatientById)
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

module.exports = router;

