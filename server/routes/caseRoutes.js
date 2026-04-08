const express = require('express');
const { addCase, getCasesByPatient, getCaseById, searchCases, getCases } = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getCases).post(protect, addCase);
router.get('/search', protect, searchCases);
router.get('/patient/:patientId', protect, getCasesByPatient);
router.get('/:id', protect, getCaseById);

module.exports = router;
