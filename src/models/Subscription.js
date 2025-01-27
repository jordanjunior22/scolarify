const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscription_id: {
    type: String,
    required: true, // Ensures that the announcement_id field is required
  },
  transaction_id: {
    type: String,
    required: true, // Ensures that the announcement_id field is required
  },
  guardian_id:{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Attendance model
    ref: 'User',
  },
  student_id:[{
    type: String,
  }],
  amount:{
    type:Number,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  status:{
    type:Boolean,
    required: true, // Ensures that status field (Present or Absent) is required
  },
  expiryDate: { // New field to track the subscription expiry date
    type: Date,
    required: false, // Only required if the subscription is active
  }
}, {
  timestamps: true 
});

// Use the model if it's already defined, or create a new one
const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
