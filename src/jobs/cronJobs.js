// jobs/cronJobs.js

const cron = require('node-cron');
const { expireInvitations } = require('../services/InvitationService'); // Adjust the path to your service file
const { updateAllStudentAges } = require('../services/UpdateStudentAges'); // Adjust the path to your service file


// Schedule the expireInvitations task to run every hour
cron.schedule('0 * * * *', async () => {
  console.log("Running invitation expiration task...");
  await expireInvitations();
});

// 📆 2. Update Student Ages – daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running student age update task...');
  await updateAllStudentAges();
});