const axios = require('axios');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
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

zomatoAPI.get('/search?entity_id=82&entity_type=city&count=20', async (req, res) => {
  try {
    const data = await req.data
    console.log(data)
    
  } catch (error) {
    console.log(error)
  }
})

router.get('/search', async (req, res) => {
    let index
    let userId = user._id

    try {
      const user = await User.findById(userId)
      index = user.index
  
      const data = await zomatoAPI.get(`/search?entity_id=82&entity_type=city&count=${index}`)
  
      const categories = data.data.restaurants
      console.log(categories)
      res.render('dashboard', { categories })
      
    } catch (error) {
      console.log(error)
    }
})

router.post('/search', async (req, res) => {
  try {
    const user = await User.findOne({username: 'test'})
    console.log(user._id)
    let userId = user._id
    let index = user.index++
    await User.findByIdAndUpdate({_id: userId, index})
    
  } catch (error) {
    console.log(error)
  }
  
})

module.exports = router;
