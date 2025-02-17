const mongoose = require('mongoose');

const ExamTypeSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const ExamType = mongoose.models.ExamType || mongoose.model('ExamType', ExamTypeSchema);
module.exports = ExamType;
 