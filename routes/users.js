
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
        console.log(errors)
        res.render('register', { errors: errors })
    } else {
        next()
    }
}, passport.authenticate('local-signup', { successRedirect: '/', failureRedirect: '/register', failureFlash: true }), (req, res) => {
    res.redirect('/')
})

router.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }), (req, res) => {
    console.log("req.body: ", req.body)
    var email = req.body.email
    //console.log(email)
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
    let formUser = req.user;
    res.render('profile-edit', {user: req.user, formUser:formUser})
})
router.get('/profile/changepassword', Auth.isLoggedIn, async (req, res) => {
    res.render('changepassword', {user: req.user})
})
router.post('/save',Auth.isLoggedIn, async (req, res) => {
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
   
    // for(let e in errors){
    //     if(errors[e].param == 'userName'){
    //         formData.name = "";
    //     }
    //     if(errors[e].param == 'userEmail'){
    //         formData.email = "";
    //     }
    // }
    if(errors){
        return res.render('profile-edit', { errors: errors ,formUser:formUser,user:req.user})
    }
    const usr = User.updateProfile(userID,userName,userEmail);
    if(!usr){
        throw 'something wrong';
    }
    req.flash('success_msg', 'Data Updated.')
    res.redirect('/profile')
});
router.post('/updatepassword',async(req,res)=>{
    let ps1 = req.body.password1;
    let ps2 = req.body.password2;
    req.checkBody('ps1', 'Password is required').notEmpty();
    req.checkBody('ps2', 'Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors()

    if (errors) {
        res.render('changepassword', { errors: errors })
    }
});
router.get('/twitter/remove', Auth.isLoggedIn, async (req, res) => {
    res.render('profile-edit', {user: req.user})
})

// router.get('/user/:id', ensureAuthenticated, (req, res) => {
//     res.send('Profile for: ' + req.param.id)
// })

module.exports = router