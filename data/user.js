var bcrypt = require('bcryptjs');
const mongoCollections = require("../config/mongoCollections"); //import db
const users = mongoCollections.users; //import collection
const uuid = require("node-uuid");

// User Schema
let exportMethods = {
	async createUser(newUser){
		// Add validation
		const hashPassword = await bcrypt.hash(newUser.password,10);
		const usersCollection = await users();
		let user = {
			_id: uuid.v4(),
			name: newUser.name,
			email: newUser.email,
			username : newUser.username,
			password : hashPassword
		}
		const newInsertInfo = await usersCollection.insertOne(user);
		const newID = newInsertInfo.insertedId;
		return await this.getUserById(newID);
	},
	async createUserTwitter(newUser){
		// Add validation
		const usersCollection = await users();
        newUser._id = uuid.v4()
		const newInsertInfo = await usersCollection.insertOne(newUser);
		const newID = newInsertInfo.insertedId;
		return await this.getUserById(newID);
	},
	async getUserById(id){
		const usersCollection = await users();
		const user = await usersCollection.findOne({_id:id});
		// if (!user){
		// 	throw 'User not found'
		// }
		return user;
	},
	async getUserByUsername(name){
		const usersCollection = await users();
		const user = await usersCollection.findOne({username:name});
		return user;
	},
	async comparePassword(candidatePassword, hash){
		try{
			let compare = await bcrypt.compare(candidatePassword,hash)
		}
		catch(e){
			throw 'Password not matched'
		}
		return compare;
	}

}

module.exports = exportMethods;
