const express = require("express")
const router = express.Router()
const data = require("../data")
const twitterConfig = require("../config/twitter")
const scraper = require("../scripts/scrape")
const personalityInsights = require("../scripts/personalityInsights")
const getInsight = personalityInsights.getInsight
const historyData = data.history
const dbConnection = require("../config/mongoConnection")
const Twit = require('twit-promise')
const Auth = require('../security/auth')

router.get("/", Auth.isLoggedIn, (req, res) => {
    res.render("dashboard", {user: req.user})
})

router.post("/", Auth.isLoggedIn, async function(req, res) {
    const twitterClient = new Twit(twitterConfig)
    let options = { screen_name: req.body.userHandle, count: 900 }

    const tweets = await scraper.getStatuses(twitterConfig, options)
    let data = tweets.tweetData

    console.log("tweet data length: ", data.length)

    let user_id = req.user._id

    try {
        let profile = await getInsight(data)

        let history = {
            user_id: user_id,
            user_name: req.user.name,
            target_handle: options.screen_name,
            tweets: data,
            insights: profile
        }

        let hObj = await historyData.createHistory(history)
        res.json(hObj)
    } catch (e) {
        res.json(null)
    }
})

module.exports = router
