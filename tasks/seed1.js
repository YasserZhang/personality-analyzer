const dbConnection = require("../config/mongoConnection");
const config = require('../config.js');
const Twit = require('twit-promise');
const scraper = require("../scripts/scrape");
const data = require("../data/");
const handles = data.handles;
const tweets = data.tweets;
const db = dbConnection();

handles.getHandleByHandle('DrDavidDuke').then(data => {
    console.log(data.maxId);
}).catch(e =>{
    console.log(e);
});