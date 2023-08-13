//FireBase configuration
const admin = require('firebase-admin');
const serviceAccount = require('../fireBase.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://sign-136a7.firebaseio.com'
});

const db = admin.firestore();

module.exports = {
    db,
};