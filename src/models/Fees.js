const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the School model
      ref: 'School',
      required: true,
    },
    fee_type: {
      type: String,
      required:true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,  // This adds createdAt and updatedAt fields automatically
  }
);

const Fee = mongoose.models.Fee || mongoose.model('Fee', FeeSchema);

module.exports = Fee;