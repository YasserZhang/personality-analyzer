const express = require("express");
const router = express.Router();
const data = require("../data");
const config = require("../config.js");
const scraper = require("../scripts/scrape");
const handleData = data.handles;
const tweetData = data.tweets;

router.get("/", async (req, res) => {
    const handleList = await handleData.getAllHandles();
    res.json(handleList);
});
router.get("/:screen_name", async (req, res) => {
    try {
        const handle = await handleData.getHandleByHandle(req.params.screen_name);
        res.json(handle);
    } catch (e) {
        res.status(404).json({error: "Handle not found"});
    }
});
router.post('/:screen_name', async (req, res) => {
    try {
        options = {
            screen_name: req.params.screen_name,
            limit: 3
        };
        const data = await scraper.getStatuses(config, options);
        let handleUser = data[0].user;
        if(await handleData.checkHandleByScreenName(handleUser.screen_name)) {
            console.log(await handleData.addHandle(handleUser));
        }
        for (let i = 0; i < data.length; i++) {
            await tweetData.addTweet(data[i]);
            console.log(data[i].id_str);
        }

    }catch(e){
        res.status(500).json({ error: e });
    }
});
module.exports = router;