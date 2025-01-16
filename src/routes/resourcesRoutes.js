const express = require('express');
const resourceController = require('../controllers/resourcesController'); // Updated controller import

const router = express.Router();
router.get('/test', resourceController.testResourcesResponse); // Updated route to match resource

// GET /resources to fetch all resource records
router.get('/get-resources', resourceController.getAllResources);

// GET /resources by id
router.get('/get-resource/:id', resourceController.getResourceById);

// POST /resources to create a new resource record
router.post('/create-resource', resourceController.createResource);

// PUT /resources/:id to update a specific resource record
router.put('/update-resource/:id', resourceController.updateResourceById);

// DELETE /resources/:id to delete a specific resource record
router.delete('/delete-resource/:id', resourceController.deleteResourceById);

module.exports = router;
