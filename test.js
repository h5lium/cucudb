

var dbinit = require('./lib/plugins/cuculibs/db/dbinit.js');


var UserDao = require('./lib/dao/user_dao.js');


dbinit({
	dbName: 'cucudb'
}, onDbInit);

function onDbInit(err, db){
	var userDao = new UserDao(db);
	userDao.open(function(err, dao){
		// insert
		/*
		dao.insert({
			username: 'aaaa',
			password: 'xxxxxx',
			summary: 'bla bla bla..'
		}, {}, function(err, docs){
			console.log(docs)
		});*/
		
		
		// remove
		/*
		dao.remove({}, {}, function(err, num){
			console.log(num);
		});*/
		
		
		// find
		/*
		dao.find({}, {}, function(err, docs){
			console.log(docs)
		});*/
		
		
		// update
		/*
		dao.update({}, {
			$set: {
				username: 'sss'
			}
		}, {}, function(err, num){
			console.log(num)
		});*/
		
		
		// validate
		/*var ok = dao.validate({
			username: 'aaaa1',
			password: '123411',
			summary: 'asdasd dsa'
		});
		console.log(ok);*/
		
		// check
		/*dao.check({
			username: 'aaaa'
		}, function(err, ok){
			console.log(ok);
		});*/
		
		
	});
}
