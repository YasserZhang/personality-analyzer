const Twit = require('twit-promise');
const data = require("../data");
const handles = data.handles;

/*
each handle can only be searched once,
then it is saved in the mongodb,
when we scrape its tweets for a second time, the max_id we previously saved
in the handle collection is not recognized by the Twit API.
As a result, the API scrape the handle's tweets from the newest.
*/
const exportedMethods = {
    async getStatuses(config, options) {
        const twitterClient = new Twit(config);
        let tweetData = [];
        let handle = undefined;
        let limit = options.count

        while (tweetData.length < limit) {
            let data = await twitterClient.get('statuses/user_timeline', options).then(result => {return result.data;}).catch( e => console.log(e));

            console.log("Scrape data length:", data.length);

            if (!Array.isArray(data)) {
                console.log(data);
                return { tweetData: [] }
            }

            if (Array.isArray(data) && data.length === 0) break;

            let min_id = data[0].id_str;

            for (tw of data) {
                if (min_id > tw.id_str) min_id = tw.id_str;
            }

            tweetData = tweetData.concat(data);
        }

        return { tweetData: tweetData }

    }
}

module.exports = exportedMethods;
