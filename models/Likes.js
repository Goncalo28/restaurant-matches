const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const likeSchema = new Schema ({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  restaurantId: Number
});

module.exports = model('Likes', likeSchema)