const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscription_id: {
    type: String,
    required: true, // Ensures that the announcement_id field is required
  },
  user_id:{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Attendance model
    ref: 'User',
  },
  status:{
    type:Boolean,
    required: true, // Ensures that status field (Present or Absent) is required
  }
}, {
  timestamps: true 
});

// Use the model if it's already defined, or create a new one
const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
