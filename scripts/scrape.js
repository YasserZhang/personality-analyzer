const Twit = require('twit-promise');
const config = require("../config.js");
const exportedMethods = {
    async getStatuses(config, options) {
        const twitterClient = new Twit(config);
        limit = options.count;
        let tweetData = [];
        while(tweetData.length < limit && tweetData.length < 3200) {
            let data = await twitterClient.get('statuses/user_timeline', options)
                            .then(result => {
                                return result.data;
                            }).catch(err=>console.log(err));
            maxId = data[data.length - 1].id - 1;
            options.max_id = maxId;
            //console.log(options);
            tweetData = tweetData.concat(data);
            options.count = options.count - data.length;
            //console.log(tweetData.length);
        }
        return tweetData;
    }
}
module.exports = exportedMethods;
