const Resource = require('../models/Resources'); // Assuming you have a Resource model
const { ensureUniqueId } = require('../utils/generateId'); 

const testResourcesResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is resource' });
};

// // Get all resource records
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create a new resource record
const createResource = async (req, res) => {
  try {
    const resourceId = await ensureUniqueId(Resource, 'resource_id', 'RSC');
    const newResource = new Resource({resource_id:resourceId, ...req.body});
    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Get a resource record by ID
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findOne({resource_id:req.params.id});
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Update resource record by ID
const updateResourceById = async (req, res) => {
  try {
    const updatedResource = await Resource.findOneAndUpdate({resource_id:req.params.id}, req.body, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete resource record by ID
const deleteResourceById = async (req, res) => {
  try {
    const deletedResource = await Resource.findOneAndDelete({resource_id:req.params.id});
    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json({ message: 'Resource record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testResourcesResponse,
  getAllResources,
  createResource,
  getResourceById,
  updateResourceById,
  deleteResourceById,
};
