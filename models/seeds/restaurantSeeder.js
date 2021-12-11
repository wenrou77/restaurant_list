const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')

const db = require('../../config/mongoose')
db.once('open', () => {
  for (let i = 0; i < restaurantNum - 1; i++) {
    Restaurant.create(restaurantList.results[i])
  }
})
