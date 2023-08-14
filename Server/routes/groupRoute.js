const express = require('express');
const router = express.Router();
const { db } = require('../FireBaseConfig');


// Get a reference to the document
const collectionRef = db.collection('Group')


// Define the route to create a new group
router.post('/createGroup', async (req, res) => {
    try {
        const userId = req.body.userId;
        const groupName = req.body.groupName;
        const groupPhotoUrl =
            req.body.groupPhotoUrl ||
            'https://st4.depositphotos.com/11634452/41441/v/600/depositphotos_414416674-stock-illustration-picture-profile-icon-male-icon.jpg';

        const docRef = collectionRef.doc();
        const groupId = docRef.id;
        const groupUsers = { [userId]: 0 };
        //creating new group
        await collectionRef.doc(groupId).set({
            groupName: groupName,
            groupId: groupId,
            groupPhotoUrl: groupPhotoUrl,
            groupUsers: groupUsers,
            groupManagerId: userId
        });
        //update user groups list
        await userRef.doc(userId).update({
            groupList: admin.firestore.FieldValue.arrayUnion(groupId)
        });

        const createdGroup = {
            groupId: groupId,
            groupName: groupName,
            groupPhotoUrl: groupPhotoUrl,
            groupUsers: groupUsers,
            groupManagerId: userId
        };
        res.status(200).json(createdGroup);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json('An error occurred');
    }
});

// Define the route to add a user to an existing group (admin only)
router.post('/addUserToGroup', async (req, res) => {
    try {
        const groupManagerId = req.body.groupManagerId;
        const currentUserId = req.body.currentUser;
        const groupId = req.body.groupId;
        const userToAddId = req.body.userToAdd;
        //check if group admin
        if (groupManagerId === currentUserId) {
            const docSnapshot = await collectionRef.doc(groupId).get();

            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                const groupUsers = data.groupUsers;

                if (!groupUsers.hasOwnProperty(userToAddId)) {
                    groupUsers[userToAddId] = 0;
                }

                await collectionRef.doc(groupId).update({ groupUsers: groupUsers });

                // UPDATE HERE THE USER GROUPS LIST WITH THE USER METHOD!!!!!!!!!
                await userRef.doc(userId).update({
                    groupList: admin.firestore.FieldValue.arrayUnion(groupId)
                });

                res.status(200).json('User added to the group');
            } else {
                res.status(404).json('No such group');
            }
        } else {
            // ADD HERE POP UP TO USER AND NOT JUST PRINT!!!!!!
            res.status(403).json('You need to be an admin to add someone to the group');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json('An error occurred');
    }
});

// Define the route to leave a group
router.post('/leaveGroup', async (req, res) => {
    try {
        const userId = req.body.user;
        const groupId = req.body.groupId;

        let usersMap = {};

        const docSnapshot = await collectionRef.doc(groupId).get();
        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            usersMap = parseMap(data.groupUsers.toString());

            if (usersMap.hasOwnProperty(userId)) {
                delete usersMap[userId];

                await collectionRef.doc(groupId).update({ groupUsers: usersMap });
                //call user leave function
                try {
                    const response = await axios.post('http://localhost:8080/user/leaveGroup', {
                      userId: userId,
                      groupId: groupId
                    });
                }
                catch(err){
                    console.log("Error: " + err);
                }

                res.status(200).json('Left the group successfully');
            } else {
                res.status(400).json('You are not a member of this group');
            }
        } else {
            res.status(404).json('No such group');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json('An error occurred');
    }
});

// Define the route to kick someone from a group (admin only)
router.post('/kickFromGroup', async (req, res) => {
    try {
        const groupManagerId = req.body.groupManagerId;
        const currentUserId = req.body.currentUser;
        const userToKick = req.body.userToKick;
        const groupId = req.body.groupId;

        if (groupManagerId === currentUserId) {
            //call user leave function to kick him
            try {
                const response = await axios.post('http://localhost:8080/user/leaveGroup', {
                  userId: userToKick,
                  groupId: groupId
                });
            }
            catch(err){
                console.log("Error: " + err);
            }

            res.status(200).json('User kicked from the group');
        } else {
            // ADD HERE POP UP TO USER AND NOT JUST PRINT!!!!
            res.status(403).json('You need to be an admin to kick someone from the group');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json('An error occurred');
    }
});


module.exports = router;
