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
		
		const newInsertInfo = await usersCollection.insertOne(newUser);
		const newID = newInsertInfo.insertedId;
		return await this.getUserById(newID);
	},
	async getUserById(id){
		const usersCollection = await users();
		const user = await usersCollection.findOne({_id:id});
		if (!user){
			throw 'User not found'
		}
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
/*var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10,function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}*/
module.exports = exportMethods;