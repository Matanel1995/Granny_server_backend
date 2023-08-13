const express = require('express')
const router = express.Router();
const {db} = require('../FireBaseConfig');







// Get a reference to the document
const collectionRef = db.collection('User')



//--------------------GET METHODS ----------------------

//GET details of specific user - using the userId. 
//PATH = /user/:userId example - http://localhost:8080/user/userId?userId=118336558897872773954
router.get('/userId', async (req, res) => {

    const docRef = collectionRef.doc(req.query.userId);

    // Get the document
    await docRef.get()
        .then((doc) => {
            if (doc.exists) {
                let responseArr = [];
                responseArr.push(doc.data());
                console.log(responseArr[0].groupList);
                res.status(200).json(responseArr);
            } else {
                res.status(404).json('No such user!')
            }
        })
        .catch((error) => {
            res.status(500).json("Server error while fetching the file");
        });
})



// remove group from user group list http://localhost:8080/user/removeFromGroup?userId=103875074505523049381&groupId=Irfn1eWkyzenuWIuG8DK
router.get('/removeFromGroup', async (req, res)=>{
    // console.log("im heree");
    const userId = req.query.userId;
    const groupId = req.query.groupId;
    console.log(userId);
    console.log(groupId);
    console.log("finished printing infomation");

    const docRef = collectionRef.doc(userId);


    // Get the document 
    const userDoc = await docRef.get();
    if(userDoc.exists){
        // get the group list from the response
        group_list = userDoc.data().groupList;
        // now check if the group Id is in the list
        // print length before 
        console.log(group_list.length);
        try{
            group_list = group_list.filter(id => id !== groupId);
            // print length after
            console.log(group_list.length);
            console.log(group_list);
            // update the group list 
            await docRef.update({ groupList: group_list});
        }
        catch (error){
            // print error message
            console.log("Error:", error)
            res.status(404).json('No such groupId!')
        }
        // print the result of the group list 
        res.status(200).json(group_list);

    }
})


// get group list from user ID http://localhost:8080/user/getGroups?userId=103875074505523049381
router.get('/getGroups', async (req, res)=>{
    // console.log("im heree");
    const userId = req.query.userId;
    // console.log(userId);
    // // console.log("finished printing infomation");

    const docRef = collectionRef.doc(userId);

    // Get the document 
    const userDoc = await docRef.get();
    if(userDoc.exists){
        // get the group list from the response
        group_list = userDoc.data().groupList;
        console.log(group_list);
        // print the result of the group list 
        res.status(200).json(group_list);
    }  
    else {
        res.status(404).json('No such groupId!')
    }
})





router.get('', async (req, res) => {
    res.send("working users");
    return "working"
}
)


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