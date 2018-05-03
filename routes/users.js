const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../data/user')

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/register', async (req, res) => {
    // check user not exist by email
    const email = req.body.email
    const password = req.body.password
    const password2 = req.body.password2

    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

    if (email) {
        req.checkBody('email', 'Email is not valid').isEmail()
    }

    const errors = req.validationErrors()

    if (errors) {
        res.render('register', { errors: errors })
    } else {

        let user = {
            email: email,
            password: password
        }

        let newUser = await User.createUserLocal(user)
        req.flash('success_msg', 'You are registered and can now login')

        // passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }, (req, res) => { res.redirect('/')})

        res.redirect('/login')
    }
})

 router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
        res.redirect('/')
    })

router.get('/logout', (req, res) => {
    //req.logout()

    req.flash('success_msg', 'You are logged out')

    res.redirect('/login')
})

// router.get('/user/:id', ensureAuthenticated, (req, res) => {
//     res.send('Profile for: ' + req.param.id)
// })

module.exports = router
