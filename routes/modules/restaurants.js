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

// router.get('/search', (req, res) => {
//   ///能夠同時搜尋餐廳名字和類別（只要其中一個條件符合就渲染出來）
//   //get each keyword
//   const keywords = req.query.keyword.toLowerCase().trim().split(' ')
//   //double loop to find the chosen restaurant
//   const restaurants = restaurantList.results.filter(restaurant => {
//     let matchKeyword = false
//     keywords.forEach(item => {
//       if (restaurant.name.toLowerCase().includes(item) ||
//         restaurant.category.toLowerCase().includes(item)) {
//         matchKeyword = matchKeyword || true
//       }
//     })
//     return matchKeyword
//   })
//   res.render('index', { restaurant: restaurants, keyword: keywords })
// })

// 新增一家餐廳(未完成，畫面一直轉)
///I. 渲染新增頁面
router.get('/new', (req, res) => {
  console.log("new enter")
  return res.render('new')
})
///II. 重新導向首頁
router.post('/', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
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
///II. 儲存編輯資料
router.put('/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
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