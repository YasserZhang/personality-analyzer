const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const morgan = require('morgan')


var path = require('path');
var cookieParser = require('cookie-parser');

const exphbs = require("express-handlebars");
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

//mongoose.connect('mongodb://localhost/loginapp');
//const db = mongoose.connection;
const User = require('./data/user')

//const routes = require('./routes/index');
//const users = require('./routes/users');

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(morgan('[:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"'));
app.use(cookieParser());
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//     secret: 'secret',
//     cookie:{secure:false}
// }));

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

passport.use(new TwitterStrategy({
        consumerKey: '4B3SJBMC6hyBnPa8FpJPtDwqH',
        consumerSecret: 'fTNgrUdTNWSr9Hc3D5Z4pEpvcgfKba19p5lu9tof8xiOSbE30N',
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
        //includeEmail: true,
        //passReqToCallback:true
    },
    function(token, tokenSecret, profile, cb) {
        console.log("Profile.......")
        console.log(token);
        console.log(tokenSecret);
        console.log(profile)
        // const twitterUser = await User.getUserByUsername(profile.username)
        //     //No user was found... so create a new user with values from Twitter (all the profile. stuff)
        //     console.log("twitteruser.....")
        //     console.log(twitterUser)
        //     if (!twitterUser) {
        //         console.log('New user from twitter')
        //         user = {
        //             name: profile.displayName,
        //             username: profile.username
        //         };
        //         let newUser = await User.createUserTwitter(user);
        //         console.log('newUser....')
        //         console.log(newUser);
        //         return cb(null,newUser._id);
        //     } else {
        //         console.log('User exists')
        //         return cb(null,twitterUser._id);
        //     }
        return cb(null, profile);
    }
));

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('>>>> LOGGED IN');
    res.redirect('/');
  });


passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://127.0.0.1:3000/");
});
