const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
restaurantNum = restaurantList.results.length

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  for (let i = 0; i < restaurantNum - 1; i++) {
    Restaurant.create(restaurantList.results[i])
  }
  console.log('mongodb connected!')
})
