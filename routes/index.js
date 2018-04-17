const handleRoutes = require("./handles");
const tweetRoutes = require("./tweets");
const insightRoutes = require("./insights");
const userRoutes = require('./users')

const constructorMethod = app => {
  app.use("/handles", handleRoutes);
  app.use("/tweets", tweetRoutes);
  app.use("/insights", insightRoutes);
  app.use("/",userRoutes)

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};



module.exports = constructorMethod;