const mongoose = require("mongoose");

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    firebaseUid: {
      type: String,
      unique: true,
      required: function () {
        return this.role !== "parent"; // Only required if the role is not "parent"
      }, 
    },
    name: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "teacher", "parent", "super"], // Example roles
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have `null` email but ensures uniqueness if provided
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have `null` phone but ensures uniqueness if provided
    },
    password: {
      type: String,
      required: function () {
        return this.role !== "parent"; // Only required if the role is not "parent"
      },
    },
    avatar: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    school_ids: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to the School model
        ref: "School",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: false,
    },
    verificationCodeExpires: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Custom validation to ensure either email or phone is provided
userSchema.path("email").validate(function (value) {
  return this.phone || value; // If email is not provided, phone must be present
}, "Either email or phone is required.");

userSchema.path("phone").validate(function (value) {
  return this.email || value; // If phone is not provided, email must be present
}, "Either email or phone is required.");

// Use the model if it's already defined, or create a new one
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
