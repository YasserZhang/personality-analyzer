const LocalStrategy = require('passport-local').Strategy
const User = require('../data/user')
let Local = {}

Local.init = (app, passport) => {
    passport.use('local-signup', new LocalStrategy({passReqToCallback: true, usernameField : 'email', passwordField : 'password'}, localSignup))
    passport.use('local-login', new LocalStrategy({passReqToCallback: true, usernameField : 'email', passwordField : 'password'}, localLogin))
}

const localSignup = async (req, email, password, cb) => {
    let isExists = await User.getUserByEmail(email)

    if (!isExists) {

        let user = {
            email: email,
            password: password
        }

        let newUser = await User.createUserLocal(user)
        return cb(null, newUser)
    } else {
        if (isExists.is_local) {
            console.log(">>>> User already register and local");
            return cb(null, false, req.flash('error_msg', 'User already register. Please login.' ))
        } else if (isExists.has_twitter) {
            console.log(">>>> User already register using Twitter");
            return cb(null, false, req.flash('error_msg', 'User already register using Twitter. Please login using Twitter and add a password from the settings.' ))
        } else {
            console.log(">>>> Error registering new user!");
            return cb(null, false, req.flash('error_msg', 'Error registering new user!' ))
        }
    }
}

const localLogin = async (req, email, password, cb) => {
    let user = await User.getUserByEmail(email)

    if (user) {
        let isMatch = await User.comparePassword(password, user.password)
        if (isMatch) return cb(null, user)
    }

    console.log('You have entered an invalid email or password');
    return cb(null, false, req.flash('error_msg', 'You have entered an invalid email or password'))
}

module.exports = Local
