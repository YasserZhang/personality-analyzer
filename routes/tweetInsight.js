const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require("../data");
const config = require("../config.js");
const scraper = require("../scripts/scrape");
const personalityInsights = require("../scripts/personalityInsights");
const getInsight = personalityInsights.getInsight;
const tweetData = data.tweets;
const handles = data.handles;
const insightData = data.insights;
const dbConnection = require("../config/mongoConnection");
const Twit = require('twit-promise');
router.get("/", (req, res) => {
  res.render("tweetInsight", {});
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
/*
router.post("/", function(request, response) {
  console.log("request,    ",request.body);
  response.render("register");
  //response.json({sucess:true, message: xss(request.body.userHandle)});
});
*/
router.post("/", async function(req, res) {
  //console.log(req.body);
  const twitterClient = new Twit(config);
  let options = {screen_name: req.body.userHandle,
              count: undefined};
  const tweets_maxId = await scraper.getStatuses(config, options);
  let data = tweets_maxId.tweetData;
  let maxId = tweets_maxId.maxId;
  if (data.length !== 0) {
    let handleUser = data[0].user;
    if(await handles.checkHandleByScreenName(handleUser.screen_name)) {
        let newHandle = await handles.addHandle(handleUser, maxId);
    } else {
        let updatedHandle = await handles.updateHandMaxId(handleUser.screen_name, maxId);
        console.log("updating maxId for user", handleUser.screen_name, maxId);
        //console.log(updatedHandle);
    }
    console.log("tweet data length: ", data.length);
    let ids = []
    for (let i = 0; i < data.length; i++) {
        await tweetData.addTweet(data[i]);
        console.log(data[i].id_str);
        ids.push(data[i].id_str);
    }
    //await db.close();
    res.render("tweets",{tweet_ids: ids});
  } else {
    console.log("tweet length", data.length);
    res.json({"error": "no tweet data is found."});
  }  
});


module.exports = router;