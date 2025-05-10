// services/invitationService.js

const Invitation = require('../models/Invitation'); // Make sure to adjust the path to your Invitation model

// Function to expire invitations
const expireInvitations = async () => {
  try {
    // Expire all pending invitations that have expired
    await Invitation.updateMany(
      { expiresAt: { $lt: new Date() }, status: "pending" },
      { $set: { status: "expired" } }
    );
    console.log("Expired invitations have been updated.");
  } catch (error) {
    console.error("Error expiring invitations:", error);
  }
};
module.exports = { expireInvitations };  
