const express = require('express');
const resourcesController = require('../controllers/resourcesController'); // Updated controller import

const router = express.Router();
router.get('/test', resourcesController.testResourcesResponse); // Updated route to match resource

// GET /resources to fetch all resource records
// router.get('/', resourceController.getAllResources);

// POST /resources to create a new resource record
// router.post('/', resourceController.createResource);

// PUT /resources/:id to update a specific resource record
// router.put('/:id', resourceController.updateResourceById);

// DELETE /resources/:id to delete a specific resource record
// router.delete('/:id', resourceController.deleteResourceById);

module.exports = router;
