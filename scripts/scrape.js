const Twit = require('twit-promise');
const config = require("../config.js");
const data = require("../data");
const handles = data.handles;

/*
each handle can only be searched once,
then it is saved in the mongodb,
when we scrape its tweets for a second time, the max_id we previously saved
in the handle collection is not recognized by the Twit API.
As a result, the API scrape the handle's tweets from the newest.
*/

function decrement(str) {
    let list = str.split('');
    let uniq = new Set(list);
    if (uniq.size === 1 && uniq.has('0')){
        throw "the argument is not a valid tweet id";
    }
    let flag = true;
    let length = list.length
    let i = 1;
    while (flag) {
        let digit = Number(list[length - i]);
        if (digit === 0) {
            list[length - i] = '9';
            i += 1;
        } else {
            digit = digit - 1;
            list[length - i] = digit.toString();
            flag = false;
        }
    }
    return list.join('');
}

const exportedMethods = {
    async getStatuses(config, options) {
        const twitterClient = new Twit(config);
        if (options.count) {
            limit = options.count;
        } else {
            limit = 3200;
        }
        let tweetData = [];
        let handle = undefined;
        let maxId = undefined;
        let newId = await handles.checkHandleByScreenName(options.screen_name);
        console.log(options.screen_name,"Is this a new Handle? ", newId);
        if (!newId) {
            handle = await handles.getHandleByHandle(options.screen_name);
            console.log("Since it is old handle, show me", handle);
            options.max_id = handle.max_id;
            console.log(options.max_id);
        }
        while(tweetData.length < limit) {
            let data = await twitterClient.get('statuses/user_timeline', options)
                            .then(result => {
                                return result.data;
                            }).catch(err=>console.log(err));
            //console.log("from scrape: ", data);
            console.log("from scrape data length", data.length);
            if (!Array.isArray(data)) {
                console.log(data);
                return {tweetData: [],
                maxId: undefined}
            }
            if (Array.isArray(data) && data.length === 0) break;
            let min_id = data[0].id_str;
            for(tw of data) {
                if (min_id > tw.id_str) min_id = tw.id_str;
            }
            console.log("minimum id:", min_id);
            min_id = decrement(min_id);
            options.max_id = min_id;
            maxId = min_id;
            //console.log(options);
            tweetData = tweetData.concat(data);
            //options.count = options.count - data.length;
            //console.log(tweetData.length);
        }
        return {tweetData: tweetData,
                maxId: maxId};
    }
}
module.exports = exportedMethods;
