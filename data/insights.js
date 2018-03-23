const mongoCollections = require("../config/mongoCollections");
const insights = mongoCollections.insights;
const uuid = require("node-uuid");
let exportedMethods = {
    getProfileById(id) {
        return insights().then(insightCollection => {
            return insightCollection.findOne({"_id": id})
                    .then(profile => {
                        if (!profile) throw "Profile not found";
                        return profile;
                    });
        });
    },
    addProfile(userHandle, profile) {
        return insights().then(insightCollection => {
            let newProfile = {
                _id: uuid.v4(),
                userHandle: userHandle,
                created: new Date(),
                profile: profile
            };
            return insightCollection.insertOne(newProfile)
                    .then(newInsertInformation => {
                        return newInsertInformation.insertedId;
                    })
                    .then(newId => {
                        return this.getProfileById(newId);
                    });
        });
    }
}
module.exports = exportedMethods;