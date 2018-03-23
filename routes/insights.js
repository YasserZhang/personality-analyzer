const dbConnection = require("../config/mongoConnection");
const express = require("express");
const router = express.Router();
const data = require("../data");
const personalityInsights = require("../scripts/personalityInsights");
const getInsight = personalityInsights.getInsight;
const tweetData = data.tweets;
const insightData = data.insights;

//testing code
const testT = personalityInsights.testT;
router.get("/test", async (req, res) => {
    res.render("insights", {});
});

router.post("/test", async (req, res) => {
    if (!req.body.userHandle) {
        return next({ code: 400, error: 'Missing required parameters: userHandle' });
    }
    const tweetList = await tweetData.getTweetsByHandle(req.body.userHandle);
    let tws = [];
    for (let tw of tweetList) {
        tws.push(tw['tweet']);
    }
    content_items = testT(tws);
    res.json(content_items);

});
//testing code end

router.get("/", async (req, res) =>{
    res.render("insights", {});
});

router.post("/", async (req, res) => {
    if (!req.body.userHandle) {
        return next({ code: 400, error: 'Missing required parameters: userHandle' });
    }
    const tweetList = await tweetData.getTweetsByHandle(req.body.userHandle);
    let tws = [];
    for (let tw of tweetList) {
        tws.push(tw['tweet']);
    }
    console.log(tws.length);
    let profile = await getInsight(tws);
    const db = await dbConnection();
    let newProfile = await insightData.addProfile(req.body.userHandle, profile);
    let structure = {
        userHandle: newProfile.userHandle,
        created: newProfile.created,
        word_count: newProfile.profile.word_count,
        processed_language: newProfile.profile.processed_language,
        personality: newProfile.profile.personality,
        needs: newProfile.profile.needs,
        values: newProfile.profile.values,
        behavior: newProfile.profile.behavior,
        consumption_preferences: newProfile.profile.consumption_preferences
    }
    //res.json(newProfile);
    res.render("result", structure);
});





module.exports = router;

