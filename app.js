const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const Restaurant = require('./models/restaurant')
//const restaurantList = require('./restaurant.json')
const app = express()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')

const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(express.static('public'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurant: restaurants }))
    .catch(error => console.error(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  ///Version 1. 只能搜尋餐廳名字或類別
  //const keyword = req.query.keyword
  // const restaurants = restaurantList.results.filter(restaurant => {
  //   return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  // })

  ///Version 2. 能夠同時搜尋餐廳名字和類別（較寬鬆的篩選，只要其中一個條件符合就渲染出來）
  //get each keyword
  const keywords = req.query.keyword.toLowerCase().trim().split(' ')
  //double loop to find the chosen restaurant
  const restaurants = restaurantList.results.filter(restaurant => {
    let matchKeyword = false
    keywords.forEach(item => {
      if (restaurant.name.toLowerCase().includes(item) ||
        restaurant.category.toLowerCase().includes(item)) {
        matchKeyword = matchKeyword || true
      }
    })
    return matchKeyword
  })
  res.render('index', { restaurant: restaurants, keyword: keywords })
})

app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`)
})