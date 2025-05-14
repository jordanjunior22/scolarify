// jobs/cronJobs.js

const cron = require('node-cron');
const { expireInvitations } = require('../services/InvitationService'); // Adjust the path to your service file
const { updateAllStudentAges } = require('../services/UpdateStudentAges'); // Adjust the path to your service file
const { createNextAcademicYear } = require('../services/CreateNextAcademicYear');


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

// Run the function at midnight every day
cron.schedule('0 0 * * *', async() => {
  console.log('Running cron job to check and create the next academic year...');
  await createNextAcademicYear();
});
