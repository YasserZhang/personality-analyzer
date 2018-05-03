const LocalStrategy = require('passport-local').Strategy
const User = require('../data/user')
let Local = {}

Local.init = (app, passport) => {
    passport.use(new LocalStrategy(localChecking))
}

const localChecking = async (email, password, cb) => {
    let user = await User.getUserByEmail(email)

    if (!user) {
        return cb(null, false, { message: 'User not found' })
    }

    let isMatch = await User.comparePassword(password, user.password)

    if (isMatch) {
        return cb(null, user._id)
    } else {
        return cb(null, false, { message: 'Invalid password' })
    }
}

module.exports = Local
