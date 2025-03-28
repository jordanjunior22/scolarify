require('dotenv').config(); // Load environment variables

var admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin; 
