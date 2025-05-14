const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true,
    unique: true,
  },

  // Guardian info
  guardian_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // School/Class associations
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },

  // Personal info
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
  },
  name: {
    type: String, // This is computed automatically
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  nationality: {
    type: String,
  },
  place_of_birth: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  // Guardian details
  guardian_name: {
    type: String,
  },
  guardian_phone: {
    type: String,
  },
  guardian_email: {
    type: String,
  },
  guardian_relationship: {
    type: String,
    enum: [
      "Mother",
      "Father",
      "Brother",
      "Sister",
      "Aunty",
      "Uncle",
      "Grand Mother",
      "Grand Father",
      "Other",
    ],
  },
  guardian_occupation: {
    type: String,
  },

  // Emergency contact
  emergency_contact_name: {
    type: String,
  },
  emergency_contact_phone: {
    type: String,
  },
  emergency_contact_relationship: {
    type: String,
    enum: [
      "Mother",
      "Father",
      "Brother",
      "Sister",
      "Aunty",
      "Uncle",
      "Grand Mother",
      "Grand Father",
      "Other",
    ],
  },

  // Academic Info
  previous_school: {
    type: String,
  },
  transcript_reportcard: {
    type: Boolean,
    default: false,
  },

  // Medical Info
  health_condition: {
    type: String,
  },
  doctors_name: {
    type: String,
  },
  doctors_contact: {
    type: String,
  },
  doctors_phone: {
    type: String,
  },

  // Financials
  fees: {
    type: Number,
    default: 0,
  },

  // Subjects
  non_compulsory_sbj: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],

  // Enrollment status
  enrollement_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["enrolled", "graduated", "dropped", "not enrolled"],
    default: "not enrolled",
  },

  // Meta/Consent
  guardian_agreed_to_terms: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

// Auto-generate `name` before saving
studentSchema.pre("save", function (next) {
  this.name = `${this.first_name} ${this.last_name}`;
  next();
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
module.exports = Student;
