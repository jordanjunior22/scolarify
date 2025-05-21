const mongoose = require("mongoose");
const { Schema } = mongoose;

// Installment sub-schema
const installmentSchema = new Schema({
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
  transactionRef: { type: String },
});

// Main FeePayment schema
const FeePaymentSchema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    school_id: { type: Schema.Types.ObjectId, ref: "School", required: true },
    class_level: { type: Schema.Types.ObjectId, ref: "ClassLevel", required: true },
    academic_year: { type: String, required: true }, // ✅ using string not academic_id anymore
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

// ✅ Automatically handle transactionRef, paidAt, and payment status
FeePaymentSchema.pre("save", function (next) {
  // Add transactionRef and paidAt if paid = true
  this.installments.forEach(inst => {
    if (inst.paid) {
      if (!inst.transactionRef) {
        inst.transactionRef = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      }
      if (!inst.paidAt) {
        inst.paidAt = new Date();
      }
    }
  });

  // Update payment status based on paid installments
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
    const fullPaid = this.installments.find(i => i.paid);
    this.status = fullPaid ? "paid" : "pending";
  }

  next();
});

const FeePayment = mongoose.models.FeePayment || mongoose.model("FeePayment", FeePaymentSchema);
module.exports = FeePayment;
