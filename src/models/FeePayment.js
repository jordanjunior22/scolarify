const mongoose = require("mongoose");
const { Schema } = mongoose;

const installmentSchema = new Schema({
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
  transactionRef: { type: String },
});

// Middleware to auto-generate transactionRef and paidAt when marking installment as paid
installmentSchema.pre('save', function (next) {
  if (this.isModified('paid') && this.paid) {
    if (!this.transactionRef) {
      this.transactionRef = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    if (!this.paidAt) {
      this.paidAt = new Date();
    }
  }
  next();
});

const FeePaymentSchema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    school_id: { type: Schema.Types.ObjectId, ref: "School", required: true },
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    academic_id: { type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },

    selectedFees: [{ type: Schema.Types.ObjectId, ref: "Fee" }],
    selectedResources: [{ type: Schema.Types.ObjectId, ref: "SchoolResource" }],

    paymentMode: {
      type: String,
      enum: ["full", "installment"],
      default: "full",
    },

    totalAmount: { type: Number, required: true },

    installments: [installmentSchema],

    status: {
      type: String,
      enum: ["pending", "partially_paid", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Automatically set payment status based on installments
FeePaymentSchema.pre("save", function (next) {
  if (this.paymentMode === "installment") {
    const total = this.installments.length;
    const paid = this.installments.filter(i => i.paid).length;

    if (paid === 0) {
      this.status = "pending";
    } else if (paid < total) {
      this.status = "partially_paid";
    } else {
      this.status = "paid";
    }
  } else {
    // For full payment mode, check if any installment is paid
    const fullPaid = this.installments.find(i => i.paid);
    this.status = fullPaid ? "paid" : "pending";
  }

  next();
});

const FeePayment = mongoose.models.FeePayment || mongoose.model("FeePayment", FeePaymentSchema);
module.exports = FeePayment;
