const express = require("express")
const router = express.Router()
const xss = require("xss")
const data = require("../data")
const config = require("../config.js")
const scraper = require("../scripts/scrape")
const personalityInsights = require("../scripts/personalityInsights")
const getInsight = personalityInsights.getInsight
const tweetData = data.tweets
const handles = data.handles
const insightData = data.insights
const historyData = data.history
const dbConnection = require("../config/mongoConnection")
const Twit = require('twit-promise')
const Auth = require('../security/auth')

router.get("/",Auth.isLoggedIn, (req, res) => {
  res.render("dashboard", {user: req.user})
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
///////////////////////////////////////
router.post("/", Auth.isLoggedIn, async function(req, res) {
    const twitterClient = new Twit(config)
    let options = {screen_name: req.body.userHandle,
                count: undefined}
    const tweets_maxId = await scraper.getStatuses(config, options)
    let data = tweets_maxId.tweetData
    let maxId = tweets_maxId.maxId
    if (data.length !== 0) {
        var handleUser = data[0].user
        if(await handles.checkHandleByScreenName(handleUser.screen_name)) {
            let newHandle = await handles.addHandle(handleUser, maxId)
    } else {
        let updatedHandle = await handles.updateHandMaxId(handleUser.screen_name, maxId)
        console.log("updating maxId for user", handleUser.screen_name, maxId)
        //console.log(updatedHandle);
    }
    console.log("tweet data length: ", data.length)
    /*
    let ids = []
    for (let i = 0; i < data.length; i++) {
        await tweetData.addTweet(data[i]);
        console.log(data[i].id_str);
        ids.push(data[i].id_str);
    }*/
    let user_id = req.user._id
    console.log("user id: ",user_id)
    let profile = await getInsight(data)
    // let newProfile = await insightData.addProfile(req.body.userHandle, profile)
    /*
    let structure = {
        userHandle: newProfile.userHandle,
        tweetCount: data.length,
        created: newProfile.created,
        word_count: newProfile.profile.word_count,
        processed_language: newProfile.profile.processed_language,
        personality: newProfile.profile.personality,
        needs: newProfile.profile.needs,
        values: newProfile.profile.values,
        behavior: newProfile.profile.behavior,
        consumption_preferences: newProfile.profile.consumption_preferences
    }
    //console.log(structure)
    */
    let history = {
        user_id: user_id,
        target_handle: handleUser.screen_name,
        tweets: data,
        insights: profile
    }
    let hObj = await historyData.createHistory(history)
    res.json(hObj)
  } else {
    console.log("tweet length", data.length)
    res.json({"error": "no tweet data is found."})
  }
})








//////////////////////////////////////
/*
old version to add tweets to tweet collection, and add insights to insights collection, and
show the result page.
*/

// router.post("/", async function(req, res) {
//   //console.log(req.body);
//   const twitterClient = new Twit(config);
//   let options = {screen_name: req.body.userHandle,
//               count: undefined};
//   const tweets_maxId = await scraper.getStatuses(config, options);
//   let data = tweets_maxId.tweetData;
//   let maxId = tweets_maxId.maxId;
//   if (data.length !== 0) {
//     let handleUser = data[0].user;
//     if(await handles.checkHandleByScreenName(handleUser.screen_name)) {
//         let newHandle = await handles.addHandle(handleUser, maxId);
//     } else {
//         let updatedHandle = await handles.updateHandMaxId(handleUser.screen_name, maxId);
//         console.log("updating maxId for user", handleUser.screen_name, maxId);
//         //console.log(updatedHandle);
//     }
//     console.log("tweet data length: ", data.length);
//     /*
//     let ids = []
//     for (let i = 0; i < data.length; i++) {
//         await tweetData.addTweet(data[i]);
//         console.log(data[i].id_str);
//         ids.push(data[i].id_str);
//     }*/
//     let profile = await getInsight(data);
//     let newProfile = await insightData.addProfile(req.body.userHandle, profile);
//     let structure = {
//         userHandle: newProfile.userHandle,
//         created: newProfile.created,
//         word_count: newProfile.profile.word_count,
//         processed_language: newProfile.profile.processed_language,
//         personality: newProfile.profile.personality,
//         needs: newProfile.profile.needs,
//         values: newProfile.profile.values,
//         behavior: newProfile.profile.behavior,
//         consumption_preferences: newProfile.profile.consumption_preferences
//     }
//     //await db.close();
//     res.render("result", structure);
//   } else {
//     console.log("tweet length", data.length);
//     res.json({"error": "no tweet data is found."});
//   }
// });


module.exports = router
