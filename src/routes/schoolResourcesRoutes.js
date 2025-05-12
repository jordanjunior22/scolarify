const express = require('express');
const schoolResourceController = require('../controllers/schoolResourcesController');
const { authenticate, authorize, checkSubscription } = require('../middleware/middleware');

const router = express.Router();

// Test route
router.get('/test', schoolResourceController.testSchoolResourceResponse);

// GET all school resources
router.get(
    '/get-resources',
    authenticate,
    checkSubscription,
    authorize(['admin', 'super', 'teacher']),
    schoolResourceController.getAllSchoolResources
);

router.get(
    '/get-resources-by-school/:school_id',
    authenticate,
    checkSubscription,
    authorize(['admin', 'super', 'teacher']),
    schoolResourceController.getSchoolResourcesBySchoolId
);


// GET single resource by ID
router.get(
    '/get-resource/:id',
    authenticate,
    checkSubscription,
    authorize(['admin', 'super', 'teacher']),
    schoolResourceController.getSchoolResourceById
);

// POST - create new resource
router.post(
    '/create-resource',
    authenticate,
    authorize(['admin', 'super']),
    schoolResourceController.createSchoolResource
);

// PUT - update resource by ID
router.put(
    '/update-resource/:id',
    authenticate,
    authorize(['admin', 'super']),
    schoolResourceController.updateSchoolResourceById
);

// DELETE - delete single resource by ID
router.delete(
    '/delete-resource/:id',
    authenticate,
    authorize(['admin', 'super']),
    schoolResourceController.deleteSchoolResourceById
);

// DELETE - delete multiple resources
router.delete(
    '/delete-resources',
    authenticate,
    authorize(['admin', 'super']),
    schoolResourceController.deleteMultipleSchoolResources
);

module.exports = router;
