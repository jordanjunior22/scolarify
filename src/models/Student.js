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
      default: [],
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
    default: null,
  },
  class_level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassLevel",
    default: null,
  },

  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  middle_name: { type: String, default: "" },
  name: { type: String, default: "" },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  nationality: { type: String, default: "" },
  place_of_birth: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  date_of_birth: { type: Date, default: null },

  guardian_name: { type: String, default: "" },
  guardian_phone: { type: String, default: "" },
  guardian_email: { type: String, default: "" },
  guardian_address: { type: String, default: "" },
  guardian_relationship: {
    type: String,
    enum: [
      "Mother", "Father", "Brother", "Sister", "Aunty", "Uncle",
      "Grand Mother", "Grand Father", "Other",
    ],
    default: "Other",
  },
  guardian_occupation: { type: String, default: "" },

  emergency_contact_name: { type: String, default: "" },
  emergency_contact_phone: { type: String, default: "" },
  emergency_contact_relationship: {
    type: String,
    enum: [
      "Mother", "Father", "Brother", "Sister", "Aunty", "Uncle",
      "Grand Mother", "Grand Father", "Other",
    ],
    default: "Other",
  },

  previous_school: { type: String, default: "" },
  transcript_reportcard: { type: Boolean, default: false },

  health_condition: { type: String, default: "" },
  doctors_name: { type: String, default: "" },
  doctors_phone: { type: String, default: "" },

  selectedFees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fee",
      default: [],
    },
  ],
  selectedResources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolResource",
      default: [],
    },
  ],
  paymentMode: {
    type: String,
    enum: ["full", "installment", null],
    default: null,
  },

  installments: {
    type: Number,
    default: null,
  },

  installmentDates: [
    {
      type: String,
      default: [],
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
      default: [],
    },
  ],

  enrollement_date: {
    type: Date,
    default: null,
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

  registered: {
    type: Boolean,
    default: false,
  },

  avatar: {
    type: String,
    default: "",
  },
}, { timestamps: true });

// Auto-generate name and calculate fees
studentSchema.pre("save", async function (next) {
  this.name = `${this.first_name} ${this.last_name}`;

  try {
    const Fee = mongoose.model("Fee");
    const Resource = mongoose.model("SchoolResource");

    const fees = await Fee.find({ _id: { $in: this.selectedFees } });
    const resources = await Resource.find({ _id: { $in: this.selectedResources } });

    const feeTotal = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const resourceTotal = resources.reduce((sum, res) => sum + (res.amount || 0), 0);

    let total = feeTotal + resourceTotal;

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
