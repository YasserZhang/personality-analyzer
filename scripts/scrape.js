const Twit = require('twit-promise');
const config = require("../config.js");
const data = require("../data");
const handles = data.handles;

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
        if (await handles.checkHandleByScreenName(options.screen_name) === false) {
            handle = await handles.getHandleByHandle(options.screen_name);
            options.max_id = handle.max_id;
        }
        while(tweetData.length < limit && tweetData.length < 3200) {
            let data = await twitterClient.get('statuses/user_timeline', options)
                            .then(result => {
                                return result.data;
                            }).catch(err=>console.log(err));
            if (data.length === 0) break;
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
