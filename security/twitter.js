const TwitterStrategy = require('passport-twitter').Strategy
const User = require('../data/user')

const twitterConfig = {
    consumerKey: '4B3SJBMC6hyBnPa8FpJPtDwqH',
    consumerSecret: 'fTNgrUdTNWSr9Hc3D5Z4pEpvcgfKba19p5lu9tof8xiOSbE30N',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
    includeEmail: true
}

let Twitter = {}


Twitter.init = (app, passport) => {
    passport.use(new TwitterStrategy(twitterConfig, twitterChecking))
    app.get('/auth/twitter', passport.authenticate('twitter'))
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/')
    })
}

const twitterChecking = async (token, tokenSecret, profile, cb) => {

    let user = {
        email: profile.emails[0].value,
        name: profile.displayName,
        twitter_token: token,
        twitter_secret: tokenSecret
    }

    try {
        let existUser = await User.getUserByEmail(user.email)
        console.log(existUser);

        if (existUser.has_twitter) {
            console.log('>>>> Twitter Exist, and has_twitter');
            return cb(null, existUser)
        } else if (!existUser.has_twitter) {
            console.log('>>>> Twitter Exist, and NO has_twitter');
            let updatedUser = await User.addTwitterToUser(existUser, user)
            return cb(null, updatedUser)
        }
    } catch (e) {
        console.log(e);
        if (e === 'NOT_FOUND') {
            console.log('>>>> Twitter NOT Exist');
            let newUser = await User.createUserTwitter(user)
            return cb(null, newUser)
        }

        console.log('Error creating or linking Twitter account')
        return cb(null, false, { message: 'Error creating or linking Twitter account' })
    }
}

module.exports = Twitter
