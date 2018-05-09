const mongoCollections = require("../config/mongoCollections");
const history = mongoCollections.history;
const uuid = require("node-uuid");

let exportedMethods = {
    //createhistory
    async createHistory(h) {
        const historyCollection = await history()

        let newHistory = {
            _id: uuid.v4(),
            user_id: h.user_id,
            user_name: h.user_name,
            target_handle: h.target_handle,
            created_At: new Date(),
            is_flagged: false,
            tweets: h.tweets,
            insights: h.insights
        }

        const newHistoryInfo = await historyCollection.insertOne(newHistory)
        const newID = newHistoryInfo.insertedId
        return await this.getHistoryById(newID)

    },
    //gethistorybyID
    async getHistoryById(id) {
        const historyCollection = await history()
        const h = await historyCollection.findOne({ _id: id })
        return h
    },
    //gethistoryforUSER
    async getHistoryForUser(user_id) {
        const historyCollection = await history()
        return await historyCollection.find({}).sort({created_At: -1}).project({user_id: user_id}).toArray()
    },
    //flaghistory (FOR ADMIN USE)
    async flaggedHistory() {
        const historyCollection = await history()
        return await historyCollection.find({is_flagged: true}).sort({created_At: -1}).toArray()
    },
    //unflaghistory
    async unflaggedHistory() {
        const historyCollection = await history()
        return await historyCollection.find({is_flagged: false}).sort({created_At: -1}).toArray()
    },
    //updateFlag
    async updateFlagById(id, flag) {
        const historyCollection = await history()

        let updatedUser = {
            is_flagged: flag
        }

        let updateCommand = { $set: updatedUser }
        await historyCollection.updateOne({ _id: id }, updateCommand)
        return await this.getHistoryById(id)


    }
}
module.exports = exportedMethods;
