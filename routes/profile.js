const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

//get profile page
router.get('/profile', async (req, res) => {
  res.render('profile');
})

// router.post('/profile', async (req, res) => {
//   res.send('profile post')
// })

module.exports = router;