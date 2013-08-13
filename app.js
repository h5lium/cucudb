
var http = require('http'),
	fs = require('fs');
var express = require('express'),
	mongodb = require('mongodb');
var dbinit = require('./lib/plugins/cuculibs/db/dbinit.js'),
	Dao = require('./lib/plugins/cuculibs/db/Dao.js');


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
	
	var userDao = new Dao(db, 'users'),
		collDao = new Dao(db, 'colls');
	userDao.open(function(err, userDao){
		app.set('userDao', userDao);
		collDao.open(function(err, collDao){
			app.set('collDao', collDao);
			onDaosInit();
		});
	});
}
// daos init done
function onDaosInit(){
	// routers
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
var dbConf = require('./config/db.js')(app);
dbinit(dbConf, onDbInit);


