const express = require("express")
const router = express.Router()
const data = require("../data")
const historyData = data.history
const Auth = require('../security/auth')

router.get('/', Auth.isLoggedIn, (req, res) => {
    res.render('admin', {user:req.user})
})

module.exports = router
