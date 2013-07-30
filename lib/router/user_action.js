
// global
var app = global.app,
	mongo = global.mongo;

// db & collection init
var db = mongo.db(global.appName),
	_seq = db.collection('_seq'),
	collName = 'user_list',
	coll = db.collection(collName);




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
	
	function isAdmin(user){
		// TODO
		return true;
	}
	
	
	// router
	app.get('/do_list_users', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'View Fail'
		}
		
		if (! hasAuth()) {
			res.send(ret);
			return;
		}
		
		coll.find({}, {
			'collections': 0
		}).toArray(function(err, docs){
			ret = {
				'ok': 1,
				'users': docs
			}
			res.send(ret);
		});
		
		function hasAuth(){
			var user = req.session.user;
			return isAdmin(user);
		}
	});
	
	app.post('/do_modify_user', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'Modify Fail'
		}
		var user_id = req.query['_id'],
			username = req.body['username'],
			password = req.body['password'],
			summary = req.body['summary'];
		
		if (! hasAuth()) {
			// has not the auth
			res.send(ret);
			return;
		}
		
		coll.findAndModify({
			'_id': user_id
		}, [], {
			$set: {
				'username': username,
				'password': password,
				'summary': summary
			}
		}, function(err, doc){
			var ret;
			if (! err && docs.length) {
				ret = {
					'ok': 1,
					'msg': 'Modify Success'
				}
			}
			res.send(ret);
		});
		
		function hasAuth(){
			var user = req.session.user;
			return isAdmin(user) || user_id === (user? user['_id']: -1);
		}
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
				var ret;
				if (! err && docs.length) {
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
			var ret;
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
		var user_id = req.query['_id']? Number(req.query['_id']): -1;
		if (! hasAuth()) {
			res.send(ret);
			return;
		}
		
		coll.findAndRemove({
			'_id': user_id
		}, [], function(err, doc){
			var ret;
			if (! err && doc) {
				ret = {
					'ok': 1,
					'msg': 'Drop Success',
					'_id': doc['_id']
				}
			}
			res.send(ret);
		});
		
		function hasAuth(){
			var user = req.session.user;
			return isAdmin(user) || user_id === (user? user['_id']: -1);
		}
	});
}
