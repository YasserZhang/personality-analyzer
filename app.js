const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");


var path = require('path');
var cookieParser = require('cookie-parser');

const exphbs = require("express-handlebars");
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var TwitterStrategy = require('passport-twitter').Strategy;

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;
var User = require('./data/user')

//var routes = require('./routes/index');
//var users = require('./routes/users');

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

  while(namespace.length) {
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg   : msg,
    value : value
  };
}
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
res.locals.user = req.user || null;
next();
});

passport.use(new TwitterStrategy({
consumerKey: 'O1qSTDA1oW46NbRBPr1ia0WbS',
consumerSecret: 'hhnkqZ4TSB7c6PGEW0Q47WDjr7WDKcO2TjISdMH3iUYmLQn8Aj',
callbackURL: "http://localhost:3000/twitter/callback",
userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
includeEmail:true
},
function(accessToken, refreshToken, profile, done) {
console.log(profile)
User.findOne({
    'username': profile.displayName 
}, function(err, user) {
    if (err) {
        return done(err);
    }
    //No user was found... so create a new user with values from Facebook (all the profile. stuff)
    if (!user) {
        user = new User({
            name: profile.displayName,
            email:profile.emails[0].value,
            username: profile.username,
            provider: 'twitter',
            //now in the future searching on User.findOne({'twitter.id': profile.id } will match because of this next line
            twitter: profile._json
        });
        user.save(function(err) {
            if (err) console.log(err);
            return done(err, user);
        });
    } else {
        return done(err, user);
    }
});
}
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/twitter/callback',
passport.authenticate('twitter', { failureRedirect: '/user/login' }),
  function(req,res){
    console.log(req.user.username);
    res.redirect("/");
  });

//app.use('/', routes);
//app.use('/users', users);

configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});