const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
restaurantNum = restaurantList.results.length
const User = require('../user')
const db = require('../../config/mongoose')
const SEED_USERS = [
  {
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', () => {
  Promise.all(
    SEED_USERS.map((user, user_index) => {
      // 創建使用者資料(user): model.create
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => User.create({
          email: user.email,
          password: hash
        })).then((user) => {
          const userRestaurant = []
          restaurantList.results.forEach((restaurant, rest_index) => {
            if (rest_index >= 3 * user_index && rest_index < 3 * (user_index + 1)) {
              restaurant.userId = user._id
              userRestaurant.push(restaurant)
            }
          })
          // 對每個user建立相對應餐廳資料
          return Restaurant.create(userRestaurant)
        })
    })
  ).then(() => {
    // 等待所有使用者的餐廳資料創建完成
    console.log('所有使用者與餐廳資料創建完成')
    process.exit()
  }).catch(error => {
    console.log(error)
  })
})