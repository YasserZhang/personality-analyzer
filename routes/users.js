const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../data/user')
const Auth = require('../security/auth')

router.get('/register', Auth.isPublic, (req, res) => {
    let e = req.flash('error_msg')[0]
    res.render('register', {error_msg: e})
})

router.get('/login', Auth.isPublic, (req, res) => {
    let e = req.flash('error_msg')[0]
    res.render('login', {error_msg: e})
})

router.post('/register', async(req, res, next) => {
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
        console.log(errors)
        res.render('register', { errors: errors, email: email })
    } else {
        next()
    }
}, passport.authenticate('local-signup', { successRedirect: '/', failureRedirect: '/register' }), (req, res) => {
    res.redirect('/')
})

router.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login'}), (req, res) => {
    console.log("req.body: ", req.body)
    var email = req.body.email
    res.redirect('/profile')
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/login')
})

router.get('/profile', Auth.isLoggedIn, async(req, res) => {
    res.render('profile', { user: req.user })
})

router.get('/profile/edit', Auth.isLoggedIn, async(req, res) => {
    let formUser = req.user;
    res.render('profile-edit', { user: req.user, formUser: formUser })
})

router.get('/profile/changepassword', Auth.isLoggedIn, async(req, res) => {
    res.render('changepassword', { user: req.user })
})

router.post('/updateprofile', Auth.isLoggedIn, async(req, res) => {
    let formUser = req.user;
    const userID = req.body.userID;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;

    req.checkBody('userName', 'Name is required').notEmpty()
    req.checkBody('userEmail', 'Email is required').notEmpty()

    formUser.email = userEmail;
    formUser.name = userName;
    if (userEmail) {
        req.checkBody('userEmail', 'Email is not valid').isEmail()
    }
    const errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.render('profile-edit', { errors: errors, formUser: formUser, user: req.user })
    }
    const usr = User.updateProfile(userID, userName, userEmail);
    if (!usr) {
        throw 'Error while updating profile.'
        res.render('profile-edit')
    }
    req.flash('success_msg', 'Your profile has been updated.')
    res.redirect('/profile')
})

router.post('/updatepassword', async(req, res) => {
    const userID = req.user._id;
    const password1 = req.body.password1
    const password2 = req.body.password2
    req.checkBody('password1', 'Password is required').notEmpty()
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password1)

    const errors = req.validationErrors()

    if (errors) {
        console.log(errors);
        return res.render('changepassword', { errors: errors,user:req.user })
    }
    const usr = User.updatePassword(userID, password1);
    if (!usr) {
        throw 'Error While Updating Password.';
        res.render('changepassword');
    }
    req.flash('success_msg', 'Your password has been changed successfully!')
    res.redirect('/profile')
})

router.get('/twitter/remove', Auth.isLoggedIn, async (req, res) => {
    let formUser = req.user;
    formUser.email = req.body.userEmail;
    formUser.name = req.body.userName;

    if (req.user.is_local) {
        let user = await User.removeTwitterFromUser(req.user)
        res.redirect('/profile')
    } else {
        req.flash('error_msg', 'You need to create a password first to have access to your account after unlinking Twitter.')
        res.redirect('/profile/changepassword')
    }

})

module.exports = router
