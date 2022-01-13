const express = require('express')
const router = express.Router()

// 引入 模組程式碼
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')  // 掛載 middleware

//將網址結構符合 / 字串的 request 導向該模組 
router.use('/restaurants', authenticator, restaurants) // 加入驗證程序
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home) // 加入驗證程序

module.exports = router