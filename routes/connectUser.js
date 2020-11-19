const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserPair = require('../models/UserPair');
const passport = require('passport');

router.post('/connect', async (req, res) => {
  let userOne = req.user._id
  let userToConnect = req.body
  try {
    const findingUserToConnect = await User.findOne(userToConnect)
    let userTwo = findingUserToConnect._id
    await User.findByIdAndUpdate(userOne, {isConnected: true})
    await User.findByIdAndUpdate(userTwo, {isConnected: true})
    await UserPair.create({userOne, userTwo})
    res.redirect('/search')
  } catch (error) {
    console.log(error)
  }
})

router.post('/delete', async (req, res) => {
  let userID = req.user._id
  try {
    
    let userPair = await UserPair.findOne({ $or: [{userOne: userID}, {userTwo: userID }]}) 

    await UserPair.findByIdAndDelete(userPair._id)

    let secondUserID;

    if (userPair.userOne.toString() !== userID.toString()) {
      secondUserID = userPair.userOne;
    } else {
      secondUserID = userPair.userTwo;
    }

    await User.findByIdAndUpdate(userID, {isConnected: false})
    await User.findByIdAndUpdate(secondUserID, {isConnected: false})

    res.redirect('/profile')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;