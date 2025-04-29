// jobs/cronJobs.js

const cron = require('node-cron');
const { expireInvitations } = require('../services/InvitationService'); // Adjust the path to your service file

// Schedule the expireInvitations task to run every 24 hours
cron.schedule('0 0 * * *', async () => {
  console.log("Running invitation expiration task...");
  await expireInvitations();
});
