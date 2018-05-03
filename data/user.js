var bcrypt = require('bcryptjs')
const mongoCollections = require("../config/mongoCollections")
const users = mongoCollections.users
const uuid = require("node-uuid")

let exportMethods = {
    async createUserLocal(u){
        const hashPassword = await bcrypt.hash(u.password,10)
        const usersCollection = await users()

        let user = {
            _id: uuid.v4(),
            name: null,
            email: u.email,
            password: hashPassword,
            is_admin: false,
            has_twitter: false,
            is_local: true,
            twitter_token: null,
            twitter_secret: null
        }
        const newInsertInfo = await usersCollection.insertOne(user)
        const newID = newInsertInfo.insertedId
        return await this.getUserById(newID)
    },

    async createUserTwitter(u){
        const usersCollection = await users()

        let user = {
            _id: uuid.v4(),
            name: u.name,
            email: u.email,
            password: null,
            is_admin: false,
            has_twitter: true,
            is_local: false,
            twitter_token: u.twitter_token,
            twitter_secret: u.twitter_secret
        }

        const newInsertInfo = await usersCollection.insertOne(user)
        const newID = newInsertInfo.insertedId
        return await this.getUserById(newID)
    },

    async getUserById(id){
        const usersCollection = await users()
        const user = await usersCollection.findOne({_id:id})

        if (!user){
            throw 'NOT_FOUND'
        }

        return user
    },

    async getUserByUsername(username){
        const usersCollection = await users()
        const user = await usersCollection.findOne({username})

        if (!user){
            throw 'NOT_FOUND'
        }

        return user
    },

    async getUserByEmail(email){
        const usersCollection = await users()
        const user = await usersCollection.findOne({email})

        if (!user){
            throw 'NOT_FOUND'
        }

        return user
    },

    async addTwitterToUser(u, t) {
        const usersCollection = await users()
        console.log(u, t);

        let updatedUser = {
            has_twitter: true,
            twitter_token: t.twitter_token,
            twitter_secret: t.twitter_secret
        }

        let updateCommand = {  $set: updatedUser }
        const query = { _id: u._id }
        await usersCollection.updateOne(query, updateCommand);
        return await this.getUserById(u._id);
    },

    async comparePassword(candidatePassword, hash){
        try {
            let compare = await bcrypt.compare(candidatePassword,hash)
        } catch(e){
            throw 'Password not matched'
        }
        return compare
    }
}

module.exports = exportMethods
