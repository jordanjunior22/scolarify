const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    period_number: {
      type: Number,
      required: true,
    },
    start_time: {
      type: String, // Storing time as a string in HH:mm:ss format
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(v);
        },
        message: "Time must be in HH:mm:ss format",
      },
    },
    end_time: {
      type: String, // Storing time as a string in HH:mm:ss format
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(v);
        },
        message: "Time must be in HH:mm:ss format",
      },
    },
    name: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Period = mongoose.models.Period || mongoose.model('Period', PeriodSchema);
module.exports = Period;