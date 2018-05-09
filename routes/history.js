const express = require("express")
const router = express.Router()
const data = require("../data")
const historyData = data.history
const Auth = require('../security/auth')

router.get('/', Auth.isLoggedIn, async (req, res) => {
    let h = await historyData.getHistoryForUser(req.user._id)
    res.render('history', {user: req.user, history:h.reverse()})
})

router.get('/:id', Auth.isLoggedIn, async (req, res) => {
    let h = await historyData.getHistoryById(req.params.id)
    res.json(h)
})

router.get('/flag/:id', Auth.isLoggedIn, async(req, res) => {
    let h = await historyData.updateFlagById(req.params.id, true)
    res.json(h)
})

router.get('/unflag/:id', Auth.isLoggedIn, async(req, res) => {
    let h = await historyData.updateFlagById(req.params.id, false)
    res.json(h)
})


module.exports = router
