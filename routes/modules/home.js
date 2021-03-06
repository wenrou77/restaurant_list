const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


// 瀏覽全部所有餐廳
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

// 新增一家餐廳
///I. 渲染新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})
///II. 重新導向首頁
router.post('/', (req, res) => {
  const userId = req.user._id
  const name = req.body.name
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.create({ userId, name, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

///搜尋餐廳名字或類別
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim()
  const sortBy = req.query.sorting
  // var sortingObj = new Object()
  // if (sortBy === 'a_to_z') let sortingObj.name_en = 'asc'
  // else if (sortBy === 'z_to_a') let sortingObj.name_en = 'desc'
  // else if (sortBy === 'category') let sortingObj.category = 'asc'
  // else if (sortBy === 'location') let sortingObj.location = 'asc'

  Restaurant.find()
    .lean()
    .sort({ name_en: 'asc' })
    .then(restaurant => {
      const filteredRestaurants = restaurant.filter(
        data => data.name.toLowerCase().includes(keyword)
      )
      res.render('index', { restaurant: filteredRestaurants, keyword })
    })
    .catch(err => console.log(err))
})

module.exports = router