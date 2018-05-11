const MongoClient = require("mongodb").MongoClient;
const dbCredentials = require("./db-credentials")

const settings = {
    mongoConfig: {
        serverUrl: dbCredentials.serverUrl,
        database: dbCredentials.database
    }
};

const mongoConfig = settings.mongoConfig;
let _connection = undefined;
let _db = undefined;
module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl);
        _db = await _connection.db(mongoConfig.database);
    }
    return _db;
}
