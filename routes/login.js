const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
//const saltRounds = 10;
const User = require('../models/User');

router.get('/', (req, res) => {
  res.render('auth/login');
});



router.post('/', (req, res) => {
  const { username, password } = req.body;

  User.findOne({'username': username})
    .then((user) => {
      if(!user) {
          res.render('auth/login', {
            errorMessage: 'Invalid login'
          })
          return;
      }

      if(bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');

      } else {
        res.render('auth/login', {
          errorMessage: 'Invalid Login'
        });
      }
    });
});



module.exports = router;