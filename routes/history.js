const express = require("express")
const router = express.Router()
const data = require("../data")
const historyData = data.history
const Auth = require('../security/auth')

router.get('/', Auth.isLoggedIn, async (req, res) => {
    let h = await historyData.getHistoryForUser(req.user.user_id)
    console.log(h);
    res.render('history', {user: req.user, history:h.reverse()})
})

router.get('/:id', Auth.isLoggedIn, async (req, res) => {
    console.log(req.params.id);
    let h = await historyData.getHistoryById(req.params.id)
    console.log(h);
    res.json(h)
})


module.exports = router
