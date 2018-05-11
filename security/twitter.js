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
    passport.use('twitter-login', new TwitterStrategy(twitterConfig, twitterLogin))
    app.get('/auth/twitter', passport.authenticate('twitter-login'))
    app.get('/auth/twitter/callback', passport.authenticate('twitter-login', { failureRedirect: '/login' }), (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/profile')
    })
}

const twitterLogin = async (token, tokenSecret, profile, cb) => {

    let user = {
        email: profile.emails[0].value,
        name: profile.displayName,
        twitter_token: token,
        twitter_secret: tokenSecret
    }

    // check if token exist
    let twitterUser = await User.getUserByTwitter(user.twitter_token)
    console.log('twitterUser:', twitterUser);

    if (twitterUser) {
        console.log('>>>> Twitter Exist');
        return cb(null, twitterUser)
    }

    let emailUser = await User.getUserByEmail(user.email)
    console.log('emailUser:', emailUser);

    if (emailUser && emailUser.has_twitter) {
        console.log('>>>> Twitter Exist, and has_twitter');
        return cb(null, emailUser)
    } else if (emailUser && !emailUser.has_twitter) {
        console.log('>>>> Twitter Exist, and NO has_twitter');
        let updatedUser = await User.addTwitterToUser(emailUser, user)
        return cb(null, updatedUser)
    } else if (emailUser == null) {
        console.log('>>>> Twitter NOT Exist');
        let newUser = await User.createUserTwitter(user)
        return cb(null, newUser)
    } else {
        console.log('Error creating or linking Twitter account')
        return cb(null, false, { message: 'Error creating or linking Twitter account' })
    }
}

module.exports = Twitter
