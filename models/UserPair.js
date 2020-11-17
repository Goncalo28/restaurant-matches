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