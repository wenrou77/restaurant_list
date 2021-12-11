const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 瀏覽全部所有餐廳
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

module.exports = router