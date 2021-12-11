const express = require('express')
const router = express.Router()

// 引入 模組程式碼
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

//將網址結構符合 / 字串的 request 導向該模組 
router.use('/', home)
router.use('/restaurants', restaurants)

module.exports = router