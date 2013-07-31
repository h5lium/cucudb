

// global
var app = global.app,
	mongo = global.mongo,
	_ = global._;

// db & collection init
var db = mongo.db(global.appName),
	collName = 'user_list',
	coll = db.collection(collName);


var isAdmin = global.isAdmin;

// router
app.post('/do_create_coll', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'Create Fail'
	}
	var ssUser = req.session.user;
	if (! ssUser) {
		res.send(ret);
		return;
	}
	var user_id = ssUser['_id'];
	
	var name = req.body['name'],
		fields = req.body['fields'],
		summary = req.body['summary'];
	// filter fields
	fields = ! fields? []: (_.isArray(fields)? fields: [fields]);
	_.filter(fields, function(val){
		return val;
	});
	var sys = ['_id'];
	fields = sys.concat(fields);
	var num = sys.length + 5;
	if (fields.length > num) {
		fields.length = num;
	}
	
	// validate
	coll.findOne({
		'_id': user_id
	}, function(err, doc){
		if (err || ! doc || _.some(doc['collections'], function(val, i){
			return val['name'] === name;
		})) {
			res.send(ret);
			return;
		}
		
		// add
		coll.findAndModify({
			'_id': user_id
		}, [], {
			$push: {
				'collections': {
					'name': name,
					'fields': fields,
					'summary': summary,
					'_data': []
				}
			}
		}, function(err, doc){
			if (! err && doc) {
				ret = {
					'ok': 1,
					'msg': 'Create Success'
				}
			}
			res.send(ret);
		});
	});
});

app.get('/do_check_user', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'View Fail'
	}
	var ssUser = req.session.user;
	if (! ssUser) {
		res.send(ret);
		return;
	}
	
	var user_id;
	if (req.query['_id']) {
		user_id = Number(req.query['_id']);
	} else {
		user_id = ssUser['_id'];
	}
	if (! hasAuth()) {
		res.send(ret);
		return;
	}
	
	coll.findOne({
		'_id': user_id,
	}, function(err, doc){
		if (! err && doc) {
			// fetch colls info
			doc['_colls'] = _.map(doc['collections'], function(val, i){
				// omit the data
				return _.omit(val, '_data');
			});
			
			ret = {
				'ok': 1,
				'user': _.omit(doc, ['collections', 'password'])
			}
		}
		res.send(ret);
	});
	
	function hasAuth(){
		return isAdmin(ssUser) || user_id === ssUser['_id'];
	}
});

