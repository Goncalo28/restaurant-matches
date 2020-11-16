const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
// const saltRounds = 10;
// const User = require('../models/User');
const passport = require('passport');

//Login route
router.get('/', (req, res) => {
  res.render('auth/login');
});

//Login route using passport
router.post('/', (req, res, next) => {
  passport.authenticate('local', (error, theUser, failureDetails) => {

    if (error) {
      // Something went wrong authenticating user
      return next(error);
    }

    if (!theUser) {
      // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
      res.render('auth/login', { errorMessage: 'Wrong password or username' });
      return;
    }

    // save user in session: req.user
    req.login(theUser, error => {

      if (error) {
        // Session save went bad
        return next(error);
      }

      // All good, we are now logged in and `req.user` is now set
      res.redirect('/home');

    });

  })(req, res, next);
});

// Dashboard route
router.get('/home', (req, res) => {
  if (!req.user) {
    res.redirect('/'); // can't access the page, so go and log in
    return;
  }
  // req.user is defined, then
  res.render('dashboard', { user: req.user });
})

//Facebook login
// router.get('/auth/facebook', passport.authenticate('facebook'));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', 
//     { successRedirect: '/',
//     failureRedirect: '/login' }));



//Without passport

// router.post('/', (req, res) => {
//   const { username, password } = req.body;

//   //Check if user exists 
//   User.findOne({'username': username})
//     .then((user) => {
//       if(!user) {
//           res.render('auth/login')
//           // add errorMessage later
//           //, {
//           //  errorMessage: 'Invalid login'
//           //})
//           return;
//       }

//       //Check if password is correct
//       if(bcrypt.compareSync(password, user.password)) {
//         req.session.currentUser = user;
//         res.render('dashboard');

//       } else {
//         res.render('auth/login')
//         // add errorMessage later
//         // , {
//         //   errorMessage: 'Invalid Login'
//         // });
//       }
//     });
// });

module.exports = router;
