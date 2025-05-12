const SchoolResource = require('../models/SchoolResources');

// Test response
const testSchoolResourceResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is the school resources endpoint' });
};

// Get all school resources
const getAllSchoolResources = async (req, res) => {
  try {
    const resources = await SchoolResource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single resource by ID
const getSchoolResourceById = async (req, res) => {
  try {
    const resource = await SchoolResource.findById(req.params.id).populate('school_id');
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new school resource
const createSchoolResource = async (req, res) => {
  try {
    const { name, school_id, category, description, price, stock, class_level } = req.body;

    const newResource = new SchoolResource({
      name,
      school_id,
      category,
      description,
      price,
      stock,
      class_level,
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a school resource
const updateSchoolResourceById = async (req, res) => {
  try {
    const updatedResource = await SchoolResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedResource) return res.status(404).json({ message: 'Resource not found' });
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a school resource
const deleteSchoolResourceById = async (req, res) => {
  try {
    const deleted = await SchoolResource.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple school resources
const deleteMultipleSchoolResources = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    const result = await SchoolResource.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No resources found for the provided IDs' });
    }
    res.json({ message: `${result.deletedCount} resources deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSchoolResourcesBySchoolId = async (req, res) => {
    try {
      const { school_id } = req.params; // Extract school_id from the request parameters
  
      if (!school_id) {
        return res.status(400).json({ message: 'School ID is required' });
      }
  
      // Fetch all school resources associated with the given school_id
      const resources = await SchoolResource.find({ school_id }).populate('school_id', 'name');
  
      if (resources.length === 0) {
        return res.status(404).json({ message: 'No resources found for this school' });
      }
  
      res.status(200).json(resources);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

module.exports = {
  testSchoolResourceResponse,
  getAllSchoolResources,
  getSchoolResourceById,
  createSchoolResource,
  updateSchoolResourceById,
  deleteSchoolResourceById,
  deleteMultipleSchoolResources,
  getSchoolResourcesBySchoolId,
};
