

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
			'msg': 'login fail'
		}
		// findOne
		dao.findOne({
			'username': req.body['username'],
			'password': req.body['password']
		}, function(err, doc){
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
		dao.find({}, {
			'ccolls': 0
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
		var attrs = {
			'username': req.body['username'],
			'password': req.body['password'],
			'summary': req.body['summary']
		}
		// validate
		if (! User.validate(attrs)) {
			res.send(ret);
			return;
		}
		// check exists
		dao.exists(_.pick(attrs, 'username'), {}, function(err, exists){
			if (exists) {
				res.send(ret);
				return;
			}
			// insert
			dao.insert(User.create(attrs).get(), function(err, docs){
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
		var attrs = {
			'summary': req.body['summary'],
			'password': req.body['password']
		}
		if (! attrs.password) {
			delete attrs['password'];
		}
		// validate
		if (! User.validate(attrs)) {
			res.send(ret);
			return;
		}
		// update
		dao.update({
			_id: ssu._id
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


