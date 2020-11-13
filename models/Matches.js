const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const matchSchema = new Schema ({
  userPair: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserPair'
  },
  restaurantId: Number
});

module.exports = model('Match', matchSchema)