const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
const personalityInsights = new PersonalityInsightsV3({
    // If unspecified here, the PERSONALITY_INSIGHTS_USERNAME and
    // PERSONALITY_INSIGHTS_PASSWORD env properties will be checked
    // After that, the SDK will fall back to the bluemix-provided
    // VCAP_SERVICES environment property
    username: "9c9c8c58-f0f9-42d5-9676-7aac835d4e2a",
    password: "oMRrakU4EjEz",
    version_date: '2016-10-19',
  });

const parentId = function(tweet) {
    if (tweet.in_reply_to_screen_name != null) {
        return tweet.in_reply_to_user_id;
    } else if (tweet.retweeted && (tweet.current_user_retweet != null)) {
        return tweet.current_user_retweet.id_str;
    }
};
const toContentItem = (tweet) => {
    return {
        id: tweet.id_str,
        language: tweet.lang,
        contenttype: 'text/plain',
        content: tweet.text.replace('[^(\\x20-\\x7F)]*',''),
        //created: Date.parse(tweet.created_at),
        created: tweet.created_at,
        reply: tweet.in_reply_to_screen_name != null,
        parentid: parentId(tweet)
    };
};

const getProfile = (params) =>
  new Promise((resolve, reject) => {
    return personalityInsights.profile(params, (err, profile) => {
      if (err) {
        reject(err);
      } else {
        resolve(profile);
      }
    });
});

const getInsight = async (tweets) => {
    console.log("tweet length:", tweets.length);
    content_items = tweets.map(toContentItem);

    params = {content_items: content_items};
    return getProfile(params);
};

//tesing code
const testT = (tweets) => {
    content_items = tweets.map(toContentItem);
    return content_items;
};
//testing code end

module.exports = {
    getInsight: getInsight,
    testT: testT
};
  
/*
personalityInsights.profile(params, function(error, response) {
    if (error) {
      console.log('error:', error);
    }
    else {
      fs.writeFile('response.json', JSON.stringify(response, null, 2), 'utf8', function(err, data){
          if (err) {
              console.log(err);
          }
          else{
              return data;
          }
      }); // write it back 
    }
});
*/