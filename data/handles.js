const mongoCollections = require("../config/mongoCollections");
const handles = mongoCollections.handles;
const uuid = require("node-uuid");
let exportedMethods = {
    async getAllHandles() {
        const handleCollection = await handles();
        return await handleCollection.find({}).toArray();
    },
    async checkHandleByScreenName(screen_name) {
        if (!screen_name) throw "No screen name is provided";
        const handleCollection = await handles();
        const handle = await handleCollection.find({"screen_name": screen_name});
        if (handle) {
            return true;
        }else {
            return false;
        }
    },
    async getHandleById(id) {
        const handleCollection = await handles();
        const handle = await handleCollection.find({_id: id});
        if (!handle) throw "Handle not found";
        return handle;
    },
    async getHandleByHandle(screen_name) {
        const handleCollection = await handles();
        const handle = await handleCollection.find({screen_name: screen_name});
        if (!handle) throw "Handle not found";
        return handle;
    },
    async addHandle(handleUser) {
        if (!handleUser) throw "no user information is provided";
        const handleCollection = await handles();
        let newHandle = {
            _id: handleUser.id,
            name: handleUser.name,
            screen_name: handleUser.screen_name,
            location: handleUser.location,
            url: handleUser.url,
            description: handleUser.description
        };
        const newInsertInformation = await handleCollection.insertOne(newHandle);
        const newId = newInsertInformation.insertedId;
        console.log(newId);
        return await this.getHandleById(newId);
    }
}
module.exports = exportedMethods;