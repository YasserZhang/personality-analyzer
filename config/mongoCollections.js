const dbConnection = require("./mongoConnection");

let getCollectionFn = collection => {
    let _col = undefined;
    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }
        return _col;
    };
};

module.exports = {
    tweets: getCollectionFn("tweets"),
    handles: getCollectionFn("handles"),
    insights: getCollectionFn("personalityInsights")
}