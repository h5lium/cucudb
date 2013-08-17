
module.exports = function(app){
	var dbConfig;
	if (app.get('isOnBAE')) {
		dbConfig = {
			dbName: 'jZLPkbYQyPBckRgYZtxK',
			host: process.env.BAE_ENV_ADDR_MONGO_IP,
			port: process.env.BAE_ENV_ADDR_MONGO_PORT,
			username: process.env.BAE_ENV_AK,
			password: process.env.BAE_ENV_SK
		}
	} else {
		dbConfig = {
			dbName: app.get('appName')
		}
	}
	return dbConfig;
}

