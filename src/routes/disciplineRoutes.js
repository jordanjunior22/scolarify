const express = require('express');
const disciplineController = require('../controllers/disciplineController'); // Updated controller import
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
// router.get('/test', disciplineController.testDisciplineResponse); // Updated route to match discipline

// GET /disciplines to fetch all discipline records
router.get('/get-discipline' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent']) , disciplineController.getAllDisciplines);

// GET /disciplines to fetch all discipline records
router.get('/get-discipline/:id' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent']) , disciplineController.getDisciplineById);

// POST /disciplines to create a new discipline record
router.post('/create-discipline' , authenticate, authorize(['admin', 'super']) , disciplineController.createDiscipline);

// PUT /disciplines/:id to update a specific discipline record
router.put('/update-discipline/:id' , authenticate, authorize(['admin', 'super']) , disciplineController.updateDisciplineById);

// DELETE /disciplines/:id to delete a specific discipline record
router.delete('/delete-discipline/:id' , authenticate, authorize(['admin', 'super']) , disciplineController.deleteDisciplineById);

//DELETE mutiple discipline records
router.delete('/delete-disciplines', authenticate, authorize(['admin', 'super']), disciplineController.deleteMultipleDisciplines);
module.exports = router;
