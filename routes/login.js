const express = require('express');
const router = express.Router();
const passport = require('passport');

//Login route
router.get('/', (req, res) => {
  if(req.user){
    res.redirect('/home')
  }
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
//     { successRedirect: '/home',
//     failureRedirect: '/login' }));

//Google login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
