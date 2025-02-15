const mongoose = require('mongoose');

const ClassScheduleSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    period_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Period",
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day_of_week: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClassSchedule = mongoose.models.ClassSchedule || mongoose.model('ClassSchedule', ClassScheduleSchema);
module.exports = ClassSchedule;