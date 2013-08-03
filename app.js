// system dependencies
var http = require('http'),
    fs = require('fs');

// non-system dependencies
var express = require('express'),
	_ = require('underscore');

// setup app
var app = express();

// global
global = {
	app: app,
	appName: 'cucudb',
	isOnBAE: fs.existsSync('./app/'),
	_: _
}

// configure app
app.configure(function(){
    app.use(express.favicon());
    app.use(express.logger('dev'));

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

// mongodb
var mongodb = require('mongodb');
new mongodb.MongoClient(new mongodb.Server('localhost', 27017, {
	native_parser: true
})).open(function(err, mongo) {
	global.mongo = mongo;
	
	 // router
	require('./lib/router/');
	// static directory
	app.use(express.static((global.isOnBAE? './app': '.') + '/static'));
	
	// server
	var server = http.createServer(app),
		port = process.APP_PORT || process.env.PORT || 80;
	
	server.listen(port, function(){
	    console.log(global.appName, 'listening on port ', port);
	});
});


