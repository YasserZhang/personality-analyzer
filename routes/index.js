const handleRoutes = require("./handles");
const tweetRoutes = require("./tweets");
const insightRoutes = require("./insights");
const userRoutes = require('./users');
const tweetInsightRoutes = require("./tweetInsight");

const constructorMethod = app => {
    app.get('/', (req, res) => { res.render('index', {user: req.user})})
    app.use("/handles", handleRoutes);
    //app.use("/tweets", tweetRoutes);
    //app.use("/insights", insightRoutes);
    app.use("/", userRoutes);
    app.use("/tweetInsight", tweetInsightRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};



module.exports = constructorMethod;
