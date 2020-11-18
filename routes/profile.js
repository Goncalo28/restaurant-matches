const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const UserPair = require('../models/UserPair');
//get profile page
router.get('/profile', async (req, res) => {
  let user = req.user
  let userID = user._id
  if (!user) {
    res.redirect('/login'); // can't access the page, so go and log in
    return;
  }

  try {
    let userPair = await UserPair.findOne({ $or: [{userOne: userID}, {userTwo: userID }]}) 
    let secondUser;
    let secondUserID;

    if(userPair){
      if (userPair.userOne.toString() !== userID.toString()) {
       secondUserID = userPair.userOne;
      } else {
       secondUserID = userPair.userTwo;
      }
      secondUser = await User.findById(secondUserID)
    }
 
    res.render('profile', { user, secondUser });
    
  } catch (error) {
    console.log(error)
  }

  
})

//Edit profile
router.get('/profile/edit', async (req, res) => {
  if (!req.user) {
    res.redirect('/login'); // can't access the page, so go and log in
    return;
  }
  try {
    let userID = req.user._id
    const user = await User.findById(userID)
    res.render('edit-profile', { user })
  } catch (error) {
    console.log(error)
  }
})

router.post('/profile/edit', async (req, res) => {
  try {
    let userID = req.user._id;
    let { firstName, lastName, email } = req.body;
    await User.findByIdAndUpdate(userID, { firstName, lastName, email })
    res.redirect('/profile')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;