const mongoose = require("mongoose");
const { Schema } = mongoose;

const installmentSchema = new Schema({
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
  transactionRef: { type: String }, // Optional: for tracking payment reference
});

const FeePaymentSchema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    school_id: { type: Schema.Types.ObjectId, ref: "School", required: true },
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    academic_id:{type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },

    selectedFees: [{ type: Schema.Types.ObjectId, ref: "Fee" }],
    selectedResources: [{ type: Schema.Types.ObjectId, ref: "SchoolResource" }],

    paymentMode: {
      type: String,
      enum: ["full", "installment"],
      default: "full",
    },

    totalAmount: { type: Number, required: true },

    installments: [installmentSchema], // only used if paymentMode is 'installment'

    status: {
      type: String,
      enum: ["pending", "partially_paid", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FeePayment = mongoose.models.FeePayment || mongoose.model('FeePayment', FeePaymentSchema);
module.exports = FeePayment;