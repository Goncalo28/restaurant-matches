const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

//get profile page
router.get('/profile', async (req, res) => {
  let user = req.user
  if (!user) {
    res.redirect('/'); // can't access the page, so go and log in
    return;
  }
  res.render('profile', { user });
})

//Edit profile
router.get('/profile/edit', async (req, res) => {
  if (!req.user) {
    res.redirect('/'); // can't access the page, so go and log in
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