const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true,
    unique: true,
  },

  guardian_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

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
  class_level: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "ClassLevel", 
    required: true
  },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  middle_name: { type: String },
  name: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  nationality: { type: String },
  place_of_birth: { type: String },
  address: { type: String },
  phone: { type: String },
  date_of_birth: { type: Date },

  guardian_name: { type: String },
  guardian_phone: { type: String },
  guardian_email: { type: String },
  guardian_address: { type: String },
  guardian_relationship: {
    type: String,
    enum: [
      "Mother", "Father", "Brother", "Sister", "Aunty", "Uncle",
      "Grand Mother", "Grand Father", "Other",
    ],
  },
  guardian_occupation: { type: String },

  emergency_contact_name: { type: String },
  emergency_contact_phone: { type: String },
  emergency_contact_relationship: {
    type: String,
    enum: [
      "Mother", "Father", "Brother", "Sister", "Aunty", "Uncle",
      "Grand Mother", "Grand Father", "Other",
    ],
  },

  previous_school: { type: String },
  transcript_reportcard: { type: Boolean, default: false },

  health_condition: { type: String },
  doctors_name: { type: String },
  doctors_phone: { type: String },

  selectedFees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fee",
    },
  ],
  selectedResources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolResource",
    },
  ],
  paymentMode: {
    type: String,
    enum: ["full", "installment"],
    default: "full",
  },
  installments: {
    type: Number,
    default: 1,
  },
  installmentDates: [
    {
      type: String,
    },
  ],
  applyScholarship: {
    type: Boolean,
    default: false,
  },
  scholarshipAmount: {
    type: Number,
    default: 0,
  },
  scholarshipPercentage: {
    type: Number,
    default: 0,
  },
  fees: {
    type: Number,
    default: 0,
  },

  non_compulsory_sbj: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],

  enrollement_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["enrolled", "graduated", "dropped", "not enrolled"],
    default: "not enrolled",
  },

  guardian_agreed_to_terms: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Auto-generate name
studentSchema.pre("save", async function (next) {
  this.name = `${this.first_name} ${this.last_name}`;

  try {
    // Populate fees and resources
    const Fee = mongoose.model("Fee");
    const Resource = mongoose.model("SchoolResource");

    const fees = await Fee.find({ _id: { $in: this.selectedFees } });
    const resources = await Resource.find({ _id: { $in: this.selectedResources } });

    // Sum amounts
    const feeTotal = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const resourceTotal = resources.reduce((sum, res) => sum + (res.amount || 0), 0);

    let total = feeTotal + resourceTotal;

    // Apply scholarshipPercentage if applicable
    if (this.applyScholarship && this.scholarshipPercentage > 0) {
      const discount = (this.scholarshipPercentage / 100) * total;
      total -= discount;
    }

    this.fees = total;
    next();
  } catch (err) {
    return next(err);
  }
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
module.exports = Student;
