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
        /*
        return handles().then(handleCollection => {
            return handleCollection.findOne({screen_name: screen_name}, {$exisit: true})
        })
        */
        const handleCollection = await handles();
        const handle = await handleCollection.findOne({"screen_name": screen_name});
        console.log("Checking an existing handle...");
        //console.log(handle);
        if (handle) {
            console.log(screen_name, "already exists in the database");
            return false;
        }else {
            console.log(screen_name, "is a new handle name.");
            return true;
        }
    },
    async getHandleById(id) {
        const handleCollection = await handles();
        const handle = await handleCollection.findOne({"_id": id});
        if (!handle) throw "Handle not found";
        return handle;
    },
    async getHandleByHandle(screen_name) {
        const handleCollection = await handles();
        const handle = await handleCollection.findOne({"screen_name": screen_name});
        if (!handle) throw "in getHandleByHandle Handle not found";
        return handle;
    },
    async updateHandMaxId(screen_name, maxId) {
        const handleCollection = await handles();
        let updatedHandleData = {};
        updatedHandleData.maxId = maxId;
        let updateCommand = {
            $set: updatedHandleData
          };
        return await handleCollection.updateOne({screen_name:screen_name}, updateCommand);
    },
    async addHandle(handleUser, maxId) {
        if (!handleUser) throw "no user information is provided";
        const handleCollection = await handles();
        let newHandle = {
            _id: handleUser.id,
            name: handleUser.name,
            screen_name: handleUser.screen_name,
            location: handleUser.location,
            url: handleUser.url,
            description: handleUser.description,
            maxId: maxId || undefined
        };
        const newInsertInformation = await handleCollection.insertOne(newHandle);
        const newId = newInsertInformation.insertedId;
        console.log(newId);
        return await this.getHandleById(newId);
    }
}
module.exports = exportedMethods;