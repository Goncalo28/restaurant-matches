const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema ({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  googleID: String,
  facebookID: String,
  index: {
    type: Number,
    default: 1
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Likes'
  }]
})

module.exports = model('User', userSchema)