

var _ = require('underscore');
var User = require('../models/User.js');

module.exports = function(app){
	var db = app.get('db');
	var userDao = app.get('userDao');
	function isAdmin(user){
		var admins = ['admin'];
		return _.contains(admins, user.username);
	}
	
	// login
	app.post('/do_login', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'login fail'
		}
		// findOne
		userDao.findOne(User.create(req.body)
		.get(['username', 'password']), function(err, doc){
			if (! err && doc) {
				// login success
				req.session.user = User.create(doc).get();
				
				ret = {
					'ok': 1,
					'msg': 'login success'
				}
			}
			res.send(ret);
		});
	});
	
	// list
	app.get('/do_list_dbs', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'view fail'
		}
		var ssu = req.session.user;
		if (! ssu || ! isAdmin(ssu)) {
			res.send(ret);
			return;
		}
		// find
		userDao.find({}, {
			'collections': 0
		}, function(err, docs){
			ret = {
				'ok': 1,
				'dbs': docs
			}
			res.send(ret);
		});
	});
	
	// reg
	app.post('/do_reg', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'create fail'
		}
		var attrs = _.pick(req.body, ['username', 'password', 'summary']);
		// validate
		if (! User.validate(attrs)) {
			res.send(ret);
			return;
		}
		// check exists
		userDao.exists(_.pick(attrs, 'username'),
		{}, function(err, exists){
			if (exists) {
				res.send(ret);
				return;
			}
			// insert
			userDao.insert(User.create(attrs).get(), function(err, docs){
				if (! err && docs.length) {
					req.session.user = User.create(docs[0]).get();
					
					ret = {
						'ok': 1,
						'msg': 'create success'
					}
				}
				res.send(ret);
			});
		});
	});
	
	// modify
	app.post('/do_modify_db', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'modify fail'
		}
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		var attrs = _.pick(req.body, ['password', 'summary']);
		attrs.password || delete attrs['password'];
		// validate
		if (! User.validate(attrs)) {
			res.send(ret);
			return;
		}
		// update
		userDao.update(_.pick(ssu, '_id'), {
			$set: attrs
		}, {}, function(err, num){
			if (! err && num) {
				ret = {
					'ok': 1,
					'msg': 'modify success'
				}
			}
			res.send(ret);
		});
	});
}


