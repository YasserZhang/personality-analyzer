const express = require("express");
const router = express.Router();
const data = require("../data");
const config = require("../config.js");
const scraper = require("../scripts/scrape");
const personalityInsights = require("../scripts/personalityInsights");
const getInsight = personalityInsights.getInsight;
const tweetData = data.tweets;
const insightData = data.insights;
const dbConnection = require("../config/mongoConnection");
const Twit = require('twit-promise');
router.get("/", async (req, res) => {
    res.render("tweets", {});
    //const tweetList = await tweetData.getAllTweets();
    //res.json(tweetList);
    /*
    const texts = [];
    for (let tw of tweetList) {
        texts.push(tw['tweet']['text']);
    }
    res.json(texts);
    */
});
router.get("/screen_name/:screen_name", async(req, res) => {
    console.log(req.params.screen_name);
    const tweetList = await tweetData.getTweetsByHandle(req.params.screen_name);
    res.json(tweetList);
});
router.get("/id/:id", async(req, res) => {
    console.log(req.params.id);
    const tweetList = await tweetData.getTweetsById(req.params.id);
    res.json(tweetList);
});
router.post("/", async (req, res) => {
    console.log(req.body);
    //const db = await dbConnection();
    //await db.dropDatabase();
    //await db.close();
    const twitterClient = new Twit(config);
    let options = {screen_name: req.body.userHandle,
                count: req.body.limit};
    const data = await scraper.getStatuses(config, options);
    let ids = []
    for (let i = 0; i < data.length; i++) {
        await tweetData.addTweet(data[i]);
        //console.log(data[i].id_str);
        ids.push(data[i].id_str);
    }
    //await db.close();
    res.render("tweets",{tweet_ids: ids});
    
});
/*
router.post("/", async(req, res, next) => {
    if (!req.body.userHandle) {
        return next({ code: 400, error: 'Missing required parameters: userHandle' });
      }
    const tweetList = await tweetData.getTweetsByHandle(req.body.userHandle);
    let tws = [];
    for (let tw of tweetList) {
        tws.push(tw['tweet']);
    }
    //res.json(tws);
    //content_items = tws.map(tweetData.toContentItem);
    let profile = await getInsight(tws);
    //console.log(profile);
    //console.log(content_items);
    //res.json(content_itmes);
    const db = await dbConnection();
    let newProfile = await insightData.addProfile(req.body.userHandle, profile);
    res.json(newProfile);
});
*/
module.exports = router;