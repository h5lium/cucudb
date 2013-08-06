
var http = require('http'),
	fs = require('fs');
var express = require('express'),
	_ = require('underscore'),
	mongodb = require('mongodb');
var mongo_init = require('./lib/mongo_init.js');


// setup app
var app = express();
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
function onDbInit(err, db){
	app.set('db', db);
	
	 // router
	require('./lib/router/')(app);
	// static directory
	app.use(express.static((app.get('isOnBAE')? './app': '.') + '/static'));
	
	// server
	var server = http.createServer(app),
		port = process.APP_PORT || process.env.PORT || 8834;
	
	server.listen(port, function(){
		console.info(app.get('appName'), 'listening on port', port);
	});
}


// setup db
var dbConfig = require('./private/db_config.js')(app);
mongo_init(dbConfig, onDbInit);


