// models/Invitation.js
const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String },
  name: { type: String },
  school_ids: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the School model
      ref: "School",
    },
  ],
  childrenIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  token: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "expired"],
    default: "pending",
  },
  invitedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }

});

const Invitation = mongoose.models.Invitation || mongoose.model('Invitation', InvitationSchema);
module.exports = Invitation;