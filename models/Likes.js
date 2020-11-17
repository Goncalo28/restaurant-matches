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

// find users that liked a restaurant
//like.find({ restaurantid: 234235})