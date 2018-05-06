const express = require("express");
const xss = require("xss");
const router = express.Router();
const data = require("../data");
const config = require("../config.js");
const scraper = require("../scripts/scrape");
const personalityInsights = require("../scripts/personalityInsights");
const getInsight = personalityInsights.getInsight;
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
router.post("/", function(request, response) {
  response.json({sucess:true, message: xss(request.body.userHandle)});
});



module.exports = router;