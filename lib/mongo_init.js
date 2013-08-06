var mongodb = require('mongodb');


/*
dbConfig = {
	dbName: 'jZLPkbYQyPBckRgYZtxK',
	host: process.env.BAE_ENV_ADDR_MONGO_IP,	// [optional]
	port: process.env.BAE_ENV_ADDR_MONGO_PORT,	// [optional]
	username: process.env.BAE_ENV_AK,	// [optional]
	password: process.env.BAE_ENV_SK	// [optional]
}

callback = function(err, db){
	
}
*/
module.exports = function(config, callback){
	// fill up config
	if (! config.host) {
		config.host = 'localhost';
	}
	if (! config.port) {
		config.port = 27017;
	}
	
	// open db
	var db = new mongodb.Db(config.dbName, new mongodb.Server(config.host, config.port, {}), {w: 1});
	db.open(function(err, db) {
		if (config.username) {
			db.authenticate(config.username, config.password, function(err, reply) { 
				if (! reply) {
					db.close();
					console.error('Authenticate failed!');
					return;
				}
				callback(err, db);
			});
		} else {
			callback(err, db);
		}
	});
}




