// system dependencies
var http = require('http'),
	fs = require('fs');
//  public dependencies
var express = require('express'),
	_ = require('underscore'),
	mongodb = require('mongodb');
// private dependencies
var mongo_init = require('./lib/mongo_init.js');


// setup app
var app = express();
// app config
app.configure(function(){
	app.set('appName', 'cucudb');
	app.set('isOnBAE', fs.existsSync('./app/'));
	
	if (! app.get('isOnBAE')) {
		app.use(express.favicon());
		app.use(express.logger('dev'));
	}
	
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'thats great'
	}));
	
	// debug
	/*app.use(function(req, res, next){
		console.log(req.body);
		next();
	});*/
});


// db init done
function dbInitDone(err, db){
	app.set('db', db);
	
	 // router
	require('./lib/router/')(app);
	// static directory
	app.use(express.static((app.get('isOnBAE')? './app': '.') + '/static'));
	
	// server
	var server = http.createServer(app),
		port = process.APP_PORT || process.env.PORT || 80;
	
	server.listen(port, function(){
		console.info(app.get('appName'), 'listening on port', port);
	});
}


// db config
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
// init mongo
mongo_init(dbConfig, dbInitDone);


