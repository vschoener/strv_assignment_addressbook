// Sourced from: https://www.firebase.com/blog/2015-04-24-end-to-end-testing-firebase-server.html

console.log("Starting firebase server...");
const FirebaseServer = require('firebase-server');
new FirebaseServer(process.env.FIREBASE_TEST_PORT || 5000, process.env.FIREBASE_TEST_URL || 'localhost', {});
