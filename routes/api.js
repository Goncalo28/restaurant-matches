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

// zomatoAPI.get('/categories', async (req, res) => {
//   const data = await req.data
//   console.log(data)
// })

// router.get('/categories', async (req, res) => {
//   const data = await zomatoAPI.get('/categories')
//   const categories = data.data.categories
//   console.log(categories)
//   //res.render('dashboard',{ categories })
// })

// zomatoAPI.get('/locations?query=Lisbon', async (req, res) => {
//   const data = await req.data
//   console.log(data)
// })

// router.get('/locations', async (req, res) => {
//   const data = await zomatoAPI.get('/locations?query=Lisbon')
//   const categories = data.data.location_suggestions
//   console.log(categories)
// })

// zomatoAPI.get('/collections?city_id=82', async (req, res) => {
//   const data = await req.data
//   console.log(data)
// })

// router.get('/collections', async (req, res) => {
//   const data = await zomatoAPI.get('/collections?city_id=82')
//   // const id = 306730
//   const categories = data.data.collections
//   console.log(categories)
// })

// zomatoAPI.get('/search?collection_id=1', async (req, res) => {
//   const data = await req.data
//   console.log(data)
// })

// router.get('/search', async (req, res) => {
//   const data = await zomatoAPI.get('/search?collection_id=1')
//   const categories = data.data.restaurants

//   console.log(categories)
//   res.render('dashboard', { categories })
// })

// zomatoAPI.get('/search?entity_id=82&entity_type=city&count=20', async (req, res) => {
//   try {
//     const data = await req.data
//     console.log(data)
//   } catch (error) {
//     console.log(error)
//   }
// })

router.get('/search', async (req, res) => {
  let user = req.user
  if (!user) {
    res.redirect('/'); // can't access the page, so go and log in
    return;
  }
   let index = req.user.index
  try {
    // const foundUser = await User.findByIdAndUpdate({userID, index: index++})
    const data = await zomatoAPI.get(`/search?entity_id=82&entity_type=city&start=${index}&count=1`)
    const restaurant = data.data.restaurants[0].restaurant
   // console.log(restaurant)
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
    // console.log(foundUser.index)
    index++
    const updateIndex = await User.findByIdAndUpdate(userID, {index: index})
   // console.log(updateIndex)
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
  //console.log(restaurantId)
  try {
    let userPair = await UserPair.find({ $or: [{userOne: userID}, {userTwo: userID }]}) 
    //console.log(userPair)
    index++
    const likes = await Likes.create({user: userID, restaurantId: restaurantId})
    await User.findByIdAndUpdate(userID, {index: index, $push: {likes: likes._id}})
    // USER PAIR FOUND
    // _id: 5fb3bc9bc9a59f7cc87cc182,
    // userOne: 5fb1cbe0c13aaa1e3a6f3d0f,
    // userTwo: 5fb2c7373d785c5d41676dcf,

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
    console.log(matchedRestaurant.restaurantId);

    res.redirect('/search')
  } catch (error) {
    console.log(error)
  }
  })

module.exports = router;



