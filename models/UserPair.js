const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userPair = new Schema ({
  userOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = model('UserPair', userPair)




  //get user by
  // find user name to match with
  // does match with current user already exist?
  // if no
  // create userPair.Create session.userid + userid do input

  //find( ) exists document com 
