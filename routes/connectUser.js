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
    await UserPair.create({userOne, userTwo})
    res.redirect('/search')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;