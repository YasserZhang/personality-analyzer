const handleRoutes = require("./handles");
const tweetRoutes = require("./tweets");
const insightRoutes = require("./insights");

const constructorMethod = app => {
  app.use("/handles", handleRoutes);
  app.use("/tweets", tweetRoutes);
  app.use("/insights", insightRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;