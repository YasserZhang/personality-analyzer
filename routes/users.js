const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../data/user')
const Auth = require('../security/auth')

router.get('/register', Auth.isPublic, (req, res) => {
    res.render('register')
})

router.get('/login', Auth.isPublic, (req, res) => {
    res.render('login')
})

router.post('/register', async (req, res, next) => {
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
        next()
    }
}, passport.authenticate('local-signup', { successRedirect: '/', failureRedirect: '/register', failureFlash: true }), (req, res) => {
    res.redirect('/')
})

router.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }), (req, res) => {
        res.redirect('/')
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/')
})

router.get('/profile', Auth.isLoggedIn, async (req, res) => {
    res.render('profile', {user: req.user})
})

router.get('/profile/edit', Auth.isLoggedIn, async (req, res) => {
    res.render('profile-edit', {user: req.user})
})

router.get('/twitter/remove', Auth.isLoggedIn, async (req, res) => {
    res.render('profile-edit', {user: req.user})
})

// router.get('/user/:id', ensureAuthenticated, (req, res) => {
//     res.send('Profile for: ' + req.param.id)
// })

module.exports = router;