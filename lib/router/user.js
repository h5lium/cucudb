
module.exports = function(app){
	var _ = require('underscore');
	var db = app.get('db');
	
	
	// collection init
	var _seq = db.collection('_seq'),
		collName = 'user_list',
		coll = db.collection(collName);
	
	
	function isAdmin(user){
		// TODO
		return true;
	}
	app.set('isAdmin', isAdmin);
	
	
	// init _seq when first
	_seq.findOne({
		_id: collName
	}, function(err, doc){
		if (! doc) {
			// not exists
			_seq.insert({
				'_id': collName,
				'id': 1
			}, initDone);
		} else {
			initDone();
		}
	});
	
	
	function initDone(){
		// router
		app.get('/do_list_dbs', function(req, res){
			var ret = {
				'ok': 0,
				'msg': 'View Fail'
			}
			var ssUser = req.session.user;
			if (! ssUser || ! hasAuth()) {
				res.send(ret);
				return;
			}
			
			coll.find({}, {
				'collections': 0
			}).toArray(function(err, docs){
				ret = {
					'ok': 1,
					'dbs': docs
				}
				res.send(ret);
			});
			
			function hasAuth(){
				return isAdmin(ssUser);
			}
		});
		
		app.post('/do_modify_db', function(req, res){
			var ret = {
				'ok': 0,
				'msg': 'Modify Fail'
			}
			var ssUser = req.session.user;
			if (! ssUser) {
				res.send(ret);
				return;
			}
			var user_id = ssUser['_id'];
			
			var username = req.body['username'],
				password = req.body['password'],
				summary = req.body['summary'];
			
			coll.findAndModify({
				'_id': user_id
			}, [], {
				$set: _.extend({
					'username': username,
					'summary': summary
				}, password? {
					'password': password
				}: {})
			}, function(err, doc){
				if (! err && doc) {
					ret = {
						'ok': 1,
						'msg': 'Modify Success'
					}
				}
				res.send(ret);
			});
		});
		
		app.post('/do_reg', function(req, res){
			var ret = {
				'ok': 0,
				'msg': 'Create Fail'
			}
			var username = req.body['username'],
				password = req.body['password'],
				summary = req.body['summary'];
			
			_seq.findAndModify({
				'_id': collName
			}, [], {
				'$inc': {
					'id': 1
				}
			}, {
				'new': false
			}, function(err, doc){
				coll.insert({
					'_id': doc['id'],
					'username': username,
					'password': password,
					'summary': summary,
					'collections': []
				}, function(err, docs){
					if (! err && docs.length) {
						req.session.user = docs[0];
						
						ret = {
							'ok': 1,
							'msg': 'Register Success',
							'_id': docs[0]['_id']
						}
					}
					res.send(ret);
				});
			});
		});
		
		app.post('/do_login', function(req, res){
			var ret = {
				'ok': 0,
				'msg': 'Login Fail'
			}
			var username = req.body['username'],
				password = req.body['password'];
			
			coll.findOne({
				'username': username,
				'password': password
			}, function(err, doc){
				if (! err && doc) {
					// login success
					req.session.user = doc;
					
					ret = {
						'ok': 1,
						'msg': 'Login Success',
						'_id': doc['_id']
					}
				}
				res.send(ret);
			});
		});
		
		app.post('/do_drop', function(req, res){
			var ret = {
				'ok': 0,
				'msg': 'Drop Fail'
			}
			var ssUser = req.session.user;
			if (! ssUser) {
				res.send(ret);
				return;
			}
			var user_id = ssUser['_id'];
			
			coll.findAndRemove({
				'_id': user_id
			}, [], function(err, doc){
				if (! err && doc) {
					ret = {
						'ok': 1,
						'msg': 'Drop Success',
						'_id': doc['_id']
					}
				}
				res.send(ret);
			});
		});
	}
}


