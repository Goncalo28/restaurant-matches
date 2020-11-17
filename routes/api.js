const axios = require('axios');
const express = require('express');
const router = express.Router();
const UserPair = require('../models/UserPair');
const User = require('../models/User');
const passport = require('passport');
const Likes = require('../models/Likes');

const zomatoAPI = axios.create({
  baseURL: 'https://developers.zomato.com/api/v2.1',
  headers: { 'user-key': process.env.ZOMATO_KEY }
});

router.get('/search', async (req, res) => {
  let user = req.user
  if (!user) {
    res.redirect('/'); // can't access the page, so go and log in
    return;
  }
   let index = req.user.index
  try {
    const data = await zomatoAPI.get(`/search?entity_id=82&entity_type=city&start=${index}&count=1`)
    const restaurant = data.data.restaurants[0].restaurant
    res.render('restaurants', restaurant )
  } catch (error) {
    console.log(error)
  }
})
router.post('/search', async (req, res) => {
  let user = req.user
  let userID = req.user._id
  let index = user.index
  try {
    const foundUser = await User.findById(userID)
    index++
    const updateIndex = await User.findByIdAndUpdate(userID, {index: index})
    res.redirect('/search')
  } catch (error) {
    console.log(error)
  }
})


router.post('/search-liked/:id', async (req, res) => {
  let user = req.user
  let userID = req.user._id
  let index = user.index
  let restaurantId = req.params.id

  try {
    
    let userPair = await UserPair.find({ $or: [{userOne: userID}, {userTwo: userID }]}) 
    index++
    const likes = await Likes.create({user: userID, restaurantId: restaurantId})
    await User.findByIdAndUpdate(userID, {index: index, $push: {likes: likes._id}})

    //find current logged in users' likes
    let currentUserLikes = user.likes

    //get second user id  
    let secondUserID = userPair[0].userTwo

    //find second user in DB 
    let secondUser = await User.findById(secondUserID)

    //secondUser likes 
    let secondUserLikes = secondUser.likes

    const match = currentUserLikes.filter(restaurant => secondUserLikes.includes(restaurant));

    const matchedRestaurant = await Likes.findById(match)

    if(matchedRestaurant.length === 0){

      res.redirect('/search')

    } else {
      
      let restaurantMatchedId = matchedRestaurant.restaurantId
      const restaurantData = await zomatoAPI.get(`/restaurant?res_id=${restaurantMatchedId}`)
      let restaurantToGoTo = restaurantData.data

      res.render('restaurant-match', restaurantToGoTo)
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
