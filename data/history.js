const mongoCollections = require("../config/mongoCollections");
const history = mongoCollections.history;
const uuid = require("node-uuid");

let exportedMethods = {
    //createhistory
    async createHistory(history) {
        const historyCollection = await history()

        let history = {
            _id: uuid.v4(),
            user_id: history.user_id,
            target_handle: history.target_handle,
            created_At: new Date(),
            is_flagged: false,
            tweets: history.tweets,
            insights: history.insights
        }

        const newHistoryInfo = await historyCollection.insertOne(history)
        const newID = newHistoryInfo.insertedId
        return await this.getHistoryById(newID)

    },
    //gethistorybyID
    async getHistoryById(id) {
        const historyCollection = await history()
        const history = await historyCollection.findOne({ _id: id })

        if (!history) {
            throw 'NOT_FOUND'
        }

        return history
    },
    //gethistoryforUSER
    async getHistoryForUser(user_id) {
        const historyCollection = await history()
        const history = await historyCollection.findOne({ user_id: user_id })

        return history

    },
    //flaghistory
    async flaggedHistory() {
        const historyCollection = await history()
        const history = await historyCollection.find({ "is_flagged": "true" })

        return history
    },
    async unflaggedHistory() {
        const historyCollection = await history()
        const history = await historyCollection.find({ "is_flagged": "false" })

        return history
    }
    //unflaghistory
}
module.exports = exportedMethods;