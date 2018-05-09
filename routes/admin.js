const express = require("express")
const router = express.Router()
const data = require("../data")
const historyData = data.history
const Auth = require('../security/auth')

router.get('/', Auth.isLoggedIn, async (req, res) => {
    let flagged = await historyData.flaggedHistory()
    let unFlagged = await historyData.unflaggedHistory()
    console.log(flagged);
    res.render('admin', {user:req.user, flagged: flagged, unFlagged: unFlagged})
})

module.exports = router
