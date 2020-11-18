const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req,res) => {
res.render('main')  
})

module.exports = router