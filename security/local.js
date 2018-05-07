const LocalStrategy = require('passport-local').Strategy
const User = require('../data/user')
let Local = {}

Local.init = (app, passport) => {
    passport.use('local-signup', new LocalStrategy({usernameField : 'email', passwordField : 'password'}, localSignup))
    passport.use('local-login', new LocalStrategy({usernameField : 'email', passwordField : 'password'}, localLogin))
}

const localSignup = async (email, password, cb) => {
    console.log('localSignup email:', email, 'password:', password)

    let isExists = await User.getUserByEmail(email)

    if (!isExists) {

        let user = {
            email: email,
            password: password
        }

        let newUser = await User.createUserLocal(user)
        return cb(null, newUser)
        // req.flash('success_msg', 'You are registered and can now login')
        // next()
        //res.redirect('/login')
    } else {
        if (isExists.is_local) {
            console.log(">>>> User already register and local");
            return cb(null, false, { message: 'User already register. Please login.' })
            res.render('register', {error_msg: 'User already register. Please login.', email: email})
        } else if (isExists.has_twitter) {
            console.log(">>>> User already register using Twitter");
            return cb(null, false, { message: 'User already register using Twitter. Please login using Twitter and add a password from the settings.' })
            res.render('register', {error_msg: 'User already register using Twitter. Please login using Twitter and add a password from the settings.', email: email})
        } else {
            console.log(">>>> Error registering new user!");
            return cb(null, false, { message: 'Error registering new user!' })
            res.render('register', {error_msg: 'Error registering new user!', email: email})
        }
    }
}

const localLogin = async (email, password, cb) => {
    console.log('localLogin email:', email, 'password:', password)
    let user = await User.getUserByEmail(email)

    if (user) {
        let isMatch = await User.comparePassword(password, user.password)
        if (isMatch) return cb(null, user)
    }

    return cb(null, false, { message: 'You have entered an invalid email or password' })
}

module.exports = Local
