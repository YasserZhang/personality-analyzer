const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const static = express.static(__dirname + "/public")
const configRoutes = require("./routes")
const morgan = require('morgan')
const Security = require('./security')
const path = require('path')
const cookieParser = require('cookie-parser')
const exphbs = require("express-handlebars")
const flash = require('connect-flash')
const session = require('express-session')
const Handlebars = require('handlebars');

app.use("/public", static)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('[:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"'))
app.use(cookieParser())
app.engine("handlebars", exphbs({ defaultLayout: "layout" }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

Handlebars.registerHelper("inc", (value, options) => {
    return parseInt(value) + 1;
})

Security.init(app)
configRoutes(app)

app.listen(3000, () => {
    console.log("App running on --> http://127.0.0.1:3000/")
})
