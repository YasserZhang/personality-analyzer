const handleRoutes = require("./handles");
const tweetRoutes = require("./tweets");
const insightRoutes = require("./insights");
const userRoutes = require('./users');
const dashboardRoutes = require("./dashboard");
const historyRoutes = require("./history");
const adminRoutes = require("./admin");

const constructorMethod = app => {
    app.get('/', (req, res) => { res.render('index', {user: req.user})})
    app.use("/handles", handleRoutes);
    app.use("/", userRoutes);
    app.use("/dashboard", dashboardRoutes);
    app.use("/history", historyRoutes);
    app.use("/admin", adminRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};



module.exports = constructorMethod;
