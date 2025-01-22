const mongoose = require('mongoose');

// Function to generate a random ID with a custom prefix
const generateId = (prefix, length = 8) => {
  const randomNumber = Math.floor(Math.random() * 1000000000000) + 1; // Generate a random number between 1 and 1 trillion (1,000,000,000,000)
  return `${prefix}-${randomNumber.toString().padStart(length, '0')}`; // Format as PREFIX-00000001
};

// Function to ensure the generated ID is unique, given a specific model and field name
const ensureUniqueId = async (model, field, prefix) => {
  if (!model || !field || !prefix) {
    throw new Error('Model, field, and prefix are required parameters.');
  }

  let id = generateId(prefix);

  // Dynamically check if the generated id already exists in the specified model and field
  while (await model.findOne({ [field]: id })) {
    // If the ID exists, generate a new one
    id = generateId(prefix);
  }

  return id;
};

module.exports = { generateId, ensureUniqueId };
