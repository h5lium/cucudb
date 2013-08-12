

var _ = require('underscore');
var User = require('../models/User.js');

module.exports = function(app){
	var db = app.get('db');
	var dao = app.get('userDao');
	
	function isAdmin(attrs){
		var admins = ['admin'];
		return _.contains(admins, attrs.username);
	}
	
	
	// login
	app.post('/do_login', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'Login Fail'
		}
		// findOne
		dao.findOne({
			'username': req.body['username'],
			'password': req.body['password']
		}, function(err, doc){
			if (! err && doc) {
				// login success
				req.session.user = (new User(doc)).attrs;
				
				ret = {
					'ok': 1,
					'msg': 'Login Success'
				}
			}
			res.send(ret);
		});
	});
	
	// list
	app.get('/do_list_dbs', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'View Fail'
		}
		var ssu = req.session.user;
		if (! ssu || ! isAdmin(ssu)) {
			res.send(ret);
			return;
		}
		// find
		dao.find({}, {
			'_collections': 0
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
			'msg': 'Create Fail'
		}
		var attrs = {
			'username': req.body['username'],
			'password': req.body['password'],
			'summary': req.body['summary']
		};
		// validate
		if (! User.validate(attrs)) {
			res.send(ret);
			return;
		}
		// check exists
		dao.exists({
			username: attrs.username
		}, {}, function(err, exists){
			if (exists) {
				res.send(ret);
				return;
			}
			// insert
			dao.insert((new User(attrs)).attrs, function(err, docs){
				if (! err && docs.length) {
					user = new User(docs[0]);
					req.session.user = user.attrs;
					
					ret = {
						'ok': 1,
						'msg': 'Create Success'
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
			'msg': 'Modify Fail'
		}
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		var attrs = _.extend({
			'summary': req.body['summary']
		}, req.body['password']? {
			'password': req.body['password']
		}: {});
		// validate
		if (! User.validate(attrs)) {
			res.send(ret);
			return;
		}
		// update
		dao.update({
			'username': ssu.username
		}, {
			$set: attrs
		}, {}, function(err, num){
			if (! err && num) {
				ret = {
					'ok': 1,
					'msg': 'Modify Success'
				}
			}
			res.send(ret);
		});
	});
}


