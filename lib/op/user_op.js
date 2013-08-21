
var _ = require('underscore');
var User = require('../models/User.js');

module.exports = function(app){
	var db = app.get('db');
	var userDao = app.get('userDao');
	
	var user_op = {};
	
	var isAdmin = function(userDoc){
		var admins = ['admin'];
		return _.contains(admins, userDoc.username);
	}
	
	user_op.loginUser = function(reqBody, callback){
		var ret = {
			'ok': 0,
			'msg': 'info incorrect'
		}
		var user = new User(reqBody);
		
		// findOne
		userDao.findOne(user.get(['username', 'password']),
		function(err, userDoc){
			if (! err && userDoc) {
				// login success
				ret = {
					'ok': 1,
					'msg': 'login success'
				}
			}
			callback(ret, userDoc);
		});
	}
	
	user_op.listUsers = function(ssu, callback){
		// find
		userDao.find({}, {}, function(err, docs){
			if (! ssu || ! isAdmin(ssu)) {
				docs = _.map(docs, function(val){
					// hide password
					val.password = '******';
					return val;
				});
			}
			
			ret = {
				'ok': 1,
				'dbs': docs
			}
			callback(ret);
		});
	}
	
	user_op.registerUser = function(reqBody, callback){
		var ret = {
			'ok': 0
		}
		var attrs = _.pick(reqBody, ['username', 'password', 'summary']);
		// validate
		if (! User.validate(attrs)) {
			ret['msg'] = 'info not validated';
			callback(ret);
			return;
		}
		var user = new User(attrs);
		// check exists
		userDao.exists(user.get(['username']), {},
		function(err, exists){
			if (exists) {
				ret['msg'] = 'db name exists';
				callback(ret);
				return;
			}
			// insert
			userDao.insert(user.get(), function(err, docs){
				var userDoc = docs[0];
				if (! err && userDoc) {
					ret = {
						'ok': 1,
						'msg': 'create success'
					}
				}
				callback(ret, userDoc);
			});
		});
	}
	
	user_op.modifyUser = function(ssu, reqBody, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		var query = reqBody['_id'] && _.pick(reqBody, '_id');
		if (! query) {
			query = _.pick(ssu, '_id');
		}
		if (query._id !== ssu._id && ! isAdmin(ssu)) {
			callback(ret);
			return;
		}
		
		var attrs = _.pick(reqBody, ['password', 'summary']);
		attrs.password || delete attrs['password'];
		// validate
		if (! User.validate(attrs)) {
			ret['msg'] = 'info not validated';
			callback(ret);
			return;
		}
		// update
		userDao.findAndModify(query, [], {
			$set: attrs
		}, {
			'new': true
		}, function(err, userDoc){
			if (! err && userDoc) {
				ret = {
					'ok': 1,
					'msg': 'modify success'
				}
			}
			callback(ret, userDoc);
		});
	}
	
	return user_op;
}

