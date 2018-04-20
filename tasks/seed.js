const dbConnection = require("../config/mongoConnection");
const config = require('../config.js');
const Twit = require('twit-promise');
const scraper = require("../scripts/scrape");
const data = require("../data/");
const handles = data.handles;
const tweets = data.tweets;
/*
getTweets = async function(config, options) {
    const twitterClient = new Twit(config);
    twitterClient.get("statuses/user_timeline", options)
}
*/

async function main(screen_name, limit) {
    const db = await dbConnection();
    await db.dropDatabase();
    const twitterClient = new Twit(config);
    //console.log(typeof handles);
    let options = { screen_name: screen_name,
        count: limit || undefined};
    /*
    const data = await twitterClient.get('statuses/user_timeline', options)
                        .then(result => {
                            //console.log(result.data);
                            return result.data;
                        }).catch(err => console.log(err));
                        */
    const tweetData = await scraper.getStatuses(config, options);
    let data = tweetData.tweetData;
    let maxId = tweetData.maxId;
    let handleUser = data[0].user;
    //console.log(handleUser);
    //console.log("length of the data", data.length);
    //const id = 12334;
    //handles.addPost("Hello, class!", "Today we are creating a blog!", [], id).catch(err => console.log(typeof handles));
    console.log(await handles.checkHandleByScreenName(handleUser.screen_name));
    if(await handles.checkHandleByScreenName(handleUser.screen_name)) {
        let newHandle = await handles.addHandle(handleUser, maxId);
        //console.log();
        //console.log(newHandle);
    }
    //console.log("print tweet ids");
    for (let i = 0; i < data.length; i++) {
        await tweets.addTweet(data[i]);
        //console.log(data[i].id_str);
        //console.log(data[i].user.screen_name);
    }
    await db.serverConfig.close();
}


/*
async function main(screen_name, limit = 10) {
    const db = await dbConnection();
    await db.dropDatabase();
    const twitterClient = new Twit(config);
    let options = { screen_name: screen_name,
        count: limit };
    twitterClient.get('statuses/user_timeline', options, function(err, data) {
        handleUser = data[0].user
        if(handles.checkHandleByScreenName(handleUser.screen_name)) {
            handles.addHandle(handleUser);
        }
        for (let i = 0; i < data.length; i++) {
            //console.log(data[i]);
            tweets.addTweet(data[i]);
            console.log(data[i].id_str);
        }
    });
    await db.close();
}
*/
//"DavidWorlock", 
let hs = ["DrDavidDuke"];
for (let h of hs) {
    main(h).catch(console.log);
}