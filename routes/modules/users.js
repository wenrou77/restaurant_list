const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/users/login',
//   failureFlash: true
//   // failureMessage: true
// }))

router.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
      // failureMessage: true
    }),
  function (req, res) {
    console.log(req)
  })

// router.post('/login', (req, res) => {
//   const { email, password } = req.body
//   const errors = []
//   if (!email || !password) {
//     errors.push({ message: 'Email和密碼欄位是必填。' })
//     return res.render('login', { errors })
//   } 
//   User.findOne({ email })
//     .then(user => {
//       if (!user) {
//         errors.push({ message: '此Email沒有註冊過。' })
//       }
//       return bcrypt.compare(password, user.password).then(isMatch => {
//         if (!isMatch) {
//           errors.push({ message: 'Email或密碼不正確。' })
//         }
//         return res.render('login', { errors })
//       })
//     })
//     .catch(err => done(err, false))
  
//   if (!errors.length) {
//     return res.redirect('/')
//   }
// })

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'Email和密碼欄位是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router