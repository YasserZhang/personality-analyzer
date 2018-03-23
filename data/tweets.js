const mongoCollections = require("../config/mongoCollections");
const tweets = mongoCollections.tweets;

let exportedMethods = {
    getAllTweets(){
        return tweets().then(tweetCollection =>{
            return tweetCollection.find({}).toArray();
        })
    },
    getTweetsById(id) {
        return tweets().then(tweetCollection => {
            return tweetCollection.find({"_id": id})
                    .then(tw => {
                        if (!tw) throw "Tweet not found";
                        return tw;
                    });
        });
    },
    checkTweetById(id){
        return tweets().then(tweetCollection => {
            return tweetCollection.findOne({"_id":id})
                    .then(tw => {
                        //console.log(tw);
                        if(tw) {
                            console.log("false");
                            return true};
                        return false;
                    });
        });
    },
    getTweetsByHandle(screen_name) {
        console.log("inside getTweetsByHandle: ", screen_name);
        return tweets().then(tweetCollection => {
            return tweetCollection.find({"tweet.user.screen_name": screen_name}).toArray();
        });
    },
    addTweet(tweet){
        if (this.checkTweetById(tweet.id_str)){
            console.log("old tweet", tweet.id_str);
            return;
        }
        
        return tweets().then(tweetCollection => {
        let newTweet = {
            _id: tweet.id_str,
            tweet: tweet
        };
        
        return tweetCollection
                .insertOne(newTweet)
                .then(newInsertInfo => {
                    return newInsertInfo.insertedId;
                })
                .then(newId => {
                    return this.getTweetsById(newId);
                });
        });
    },
    toContentItem(tweet){
        return {
          id: tweet.id_str,
          language: tweet.lang,
          contenttype: 'text/plain',
          content: tweet.text.replace('[^(\\x20-\\x7F)]*',''),
          created: Date.parse(tweet.created_at),
          reply: tweet.in_reply_to_screen_name != null
        };
      }
};
module.exports = exportedMethods;