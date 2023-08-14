const express = require('express')
const router = express.Router();
const { db } = require('../FireBaseConfig');

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
router.post('/removeFromGroup', async (req, res) => {
    const userId = req.query.userId;
    const groupId = req.query.groupId;
    const docRef = collectionRef.doc(userId);
    // Get the document 
    const userDoc = await docRef.get();
    if (userDoc.exists) {
        // get the group list from the response
        group_list = userDoc.data().groupList;
        // now check if the group Id is in the list
        try {
            group_list = group_list.filter(id => id !== groupId);
            // update the group list 
            await docRef.update({ groupList: group_list });
        }
        catch (error) {
            // print error message
            console.log("Error:", error)
            res.status(404).json('No such groupId!')
        }
        // print the result of the group list 
        res.status(200).json(group_list);

    }
})


// get group list from user ID http://localhost:8080/user/getGroups?userId=103875074505523049381
router.get('/getGroups', async (req, res) => {
    const userId = req.query.userId;
    const docRef = collectionRef.doc(userId);
    // Get the document 
    const userDoc = await docRef.get();
    if (userDoc.exists) {
        // get the group list from the response
        group_list = userDoc.data().groupList;
        // print the result of the group list 
        res.status(200).json(group_list);
    }
    else {
        res.status(404).json('No such groupId!')
    }
})

router.post('/leaveGroup', async (req, res) => {
    try {
        const userId = req.body.userId;
        const groupId = req.body.groupId;

        const docRef = collectionRef.doc(userId);
        const userDoc = await docRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            const groupList = parseGroupList(userData.groupList.toString());

            if (groupList.includes(groupId)) {
                groupList.splice(groupList.indexOf(groupId), 1);
                await docRef.update({ groupList: groupList });
                res.status(200).json('Successfully left the group');
            } else {
                res.status(400).json('You are not a member of this group');
            }
        } else {
            res.status(404).json('No such user!');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json('An error occurred');
    }
});


// Parse the group list string into an array
function parseGroupList(groupListString) {
    return groupListString.split(',');
}


router.get('', async (req, res) => {
    res.send("working users");
    return "working"
}
)




module.exports = router;