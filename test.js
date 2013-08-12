

var dbinit = require('./lib/plugins/cuculibs/db/dbinit.js');
var Dao = require('./lib/plugins/cuculibs/db/Dao.js');

var User = require('./lib/models/User.js');

dbinit({
	dbName: 'cucudb'
}, onDbInit);

function onDbInit(err, db){
	var userDao = new Dao(db, 'users');
	userDao.open(function(err, dao){
		// Model
		var user1 = new User({
			username: 'admin',
			password: '123321',
			summary: 'hahaha'
		});
		console.log(user1.validate());
		console.log(user1.lastErrorKey);
		
		
		// clear, insert
		dao.clear(function(){
			dao.insert(user1.attrs, {}, function(err, docs){
				console.log(docs);
			});
		});
		
		
		// remove
		/*dao.remove({}, {}, function(err, num){
			console.log(num);
		});*/
		
		
		// find
		dao.find({}, {}, function(err, docs){
			console.log(docs)
		});
		
		
		// update
		/*dao.update({}, {
			$set: {
				username: 'ssss'
			}
		}, {}, function(err, num){
			console.log(num)
		});*/
		
		
		// exists
		/*dao.exists({
			username: 'ssss'
		}, {}, function(err, exists){
			console.log(exists);
		});*/
		
		
		
		
	});
}
