const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')
const app = express()
const port = process.env.PORT || 3000

//連線資料庫
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(express.static('public'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

// 瀏覽全部所有餐廳
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

// 瀏覽一家餐廳的詳細資訊
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  ///能夠同時搜尋餐廳名字和類別（較寬鬆的篩選，只要其中一個條件符合就渲染出來）
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

// 新增一家餐廳(未完成，畫面一直轉)
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  const name = req.body.name
  return Restaurant.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//修改一家餐廳的資訊
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
app.post('/restaurants/:id/edit', (req, res) => {
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

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})