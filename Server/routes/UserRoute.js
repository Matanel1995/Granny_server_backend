const express = require('express')
const router = express.Router();


//FireBase configuration
const admin = require('firebase-admin');
const serviceAccount = require('../../fireBase.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://sign-136a7.firebaseio.com'
});
const db = admin.firestore();



// Get a reference to the document
const collectionRef = db.collection('User')



//--------------------GET METHODS ----------------------

//GET details of specific user - using the userId. 
//PATH = /user/:userId
router.get('/:userId', async (req, res) => {

    const docRef = collectionRef.doc(req.params.userId);

    // Get the document
    await docRef.get()
        .then((doc) => {
            if (doc.exists) {
                let responseArr = [];
                responseArr.push(doc.data());
                res.status(200).json(responseArr);
            } else {
                res.status(404).json('No such user!')
            }
        })
        .catch((error) => {
            res.status(500).json("Server error while fetching the file");
        });
})


/*
משתמש - 

    GET -   *הבאת משתמשים (מחזירה רשימה של משתמשים)(יחיד \ רבים).
                 *הבאת הקבוצות (מחזריה רשימה של הקבוצות של אותו משתמש) (יחיד \ רבים).

    POST-  *הוספה של יוזר לקבוצה כאשר הוא פותח אותה (עדכון) (אולי אפשר להשתמש בפונקציה שבPUT).
    	
    PUT- *הוספה של יוזר לקבוצה (עדכון).
              *יציאה מקבוצה (עדכון \ אם אחרון בקבוצה מחיקה של הקבוצה).
*/


//--------------------POST METHODS ----------------------


//--------------------DELETE METHODS ----------------------


//--------------------PUT METHODS ----------------------




module.exports = router;