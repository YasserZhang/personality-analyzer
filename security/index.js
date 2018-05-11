const passport = require('passport')
const expressValidator = require('express-validator')
const Twitter = require('./twitter')
const Local = require('./local')
const User = require('../data/user')

let Security = {}

Security.init = app => {
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(expressValidator({ errorFormatter: errorFormatter }))
    Twitter.init(app, passport)
    Local.init(app, passport)

    passport.serializeUser((user, cb) => {
        cb(null, user._id)
    })

    passport.deserializeUser(async (id, cb) => {
        try {
            let user = await User.getUserById(id)
            cb(null, user)
        } catch (e) {
            cb(null, false)
        }
    })
}

const errorFormatter = (param, msg, value) => {
    var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root

    while (namespace.length) {
        formParam += '[' + namespace.shift() + ']'
    }

    return {
        param: formParam,
        msg: msg,
        value: value
    }
}

module.exports = Security
