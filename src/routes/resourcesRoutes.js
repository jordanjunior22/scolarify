const express = require('express');
const resourceController = require('../controllers/resourcesController'); // Updated controller import
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');


const router = express.Router();
// router.get('/test', resourceController.testResourcesResponse); // Updated route to match resource

// GET /resources to fetch all resource records
router.get('/get-resources' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent']) , resourceController.getAllResources);

// GET /resources by id
router.get('/get-resource/:id' , authenticate, checkSubscription, authorize(['admin', 'super', 'parent']) , resourceController.getResourceById);

// POST /resources to create a new resource record
router.post('/create-resource' , authenticate, authorize(['admin', 'super']) , resourceController.createResource);

// PUT /resources/:id to update a specific resource record
router.put('/update-resource/:id' , authenticate, authorize(['admin', 'super']) , resourceController.updateResourceById);

// DELETE /resources/:id to delete a specific resource record
router.delete('/delete-resource/:id' , authenticate, authorize(['admin', 'super']) , resourceController.deleteResourceById);

module.exports = router;
