const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 瀏覽一家餐廳的詳細資訊
router.get('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

//修改一家餐廳的資訊
///I. 渲染編輯頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
///II. update資料
router.put('/:id', (req, res) => {
  const id = req.params.id
  const request = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = request.name
      restaurant.category = request.category
      restaurant.location = request.location
      restaurant.phone = request.phone
      restaurant.description = request.description
      restaurant.image = request.image
      restaurant.google_map = request.google_map
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//刪除一家餐廳
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router