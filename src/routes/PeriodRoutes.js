const express = require('express');
const periodController = require('../controllers/PeriodsController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');

const router = express.Router();

router.get('/test', periodController.testPeriodResponse);
router.get('/get-periods', authenticate, checkSubscription, authorize(['admin', 'super', 'teacher','parent']), periodController.getAllPeriods);
router.get('/get-period/:id', authenticate, checkSubscription, authorize(['admin', 'super', 'teacher','parent']), periodController.getPeriodById);
router.post('/create-period', authenticate, authorize(['admin', 'super']), periodController.createPeriod);
router.put('/update-period/:id', authenticate, authorize(['admin', 'super']), periodController.updatePeriodById);
router.delete('/delete-period/:id', authenticate, authorize(['admin', 'super']), periodController.deletePeriodById);

module.exports = router;
