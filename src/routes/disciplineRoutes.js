const express = require('express');
const disciplineController = require('../controllers/disciplineController'); // Updated controller import

const router = express.Router();
router.get('/test', disciplineController.testDisciplineResponse); // Updated route to match discipline

// GET /disciplines to fetch all discipline records
// router.get('/', disciplineController.getAllDisciplines);

// POST /disciplines to create a new discipline record
// router.post('/', disciplineController.createDiscipline);

// PUT /disciplines/:id to update a specific discipline record
// router.put('/:id', disciplineController.updateDisciplineById);

// DELETE /disciplines/:id to delete a specific discipline record
// router.delete('/:id', disciplineController.deleteDisciplineById);

module.exports = router;
