

// global
var app = global.app,
	mongo = global.mongo,
	_ = global._;

// db & collection init
var db = mongo.db(global.appName),
	collName = 'user_list',
	coll = db.collection(collName);


var isAdmin = global.isAdmin;


var sysFields = ['_id'],
	maxNumUserFields = 4,
	maxNumFields = sysFields.length + maxNumUserFields;


// router
app.post('/do_remove_colls', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'Remove Fail'
	}
	// user id
	var ssUser = req.session.user;
	if (! ssUser) {
		res.send(ret);
		return;
	}
	var user_id = ssUser['_id'];
	
	// ccoll_names
	var ccoll_names = req.body['names'];
	ccoll_names = ! ccoll_names? []:
		(_.isArray(ccoll_names)? ccoll_names: [ccoll_names]);
	
	// pull
	var target = 'collections';
	_.each(ccoll_names, function(val){
		var pullInfo = {};
		pullInfo[target] = {
			'name': val
		};
		coll.update({
			'_id': user_id
		}, {
			'$pull': pullInfo
		}, function(err, num){});
	});
	ret = {
		'ok': 1,
		'msg': 'Remove Success'
	}
	res.send(ret);
});

app.post('/do_remove_records', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'Remove Fail'
	}
	// user id
	var ssUser = req.session.user;
	if (! ssUser) {
		res.send(ret);
		return;
	}
	var user_id = ssUser['_id'];
	
	// ccoll_name & record_ids
	var ccoll_name = req.query['coll'],
		record_ids = req.body['_ids'];
	record_ids = ! record_ids? []:
		(_.isArray(record_ids)? record_ids: [record_ids]);
	record_ids = _.map(record_ids, function(val){
		return Number(val);
	});
	
	
	coll.findOne({
		'_id': user_id
	}, function(err, doc){
		if (err || ! doc) {
			res.send(ret);
			return;
		}
		
		// coll index
		var ccolls = doc['collections'],
			ccoll = _.where(ccolls, {
			'name': ccoll_name
		})[0];
		if (! ccoll) {
			res.send(ret);
			return;
		}
		var index = ccolls.indexOf(ccoll);
		
		// pull
		var target = ['collections', index, '_records'].join('.');
		_.each(record_ids, function(val){
			var pullInfo = {};
			pullInfo[target] = {
				'_id': val
			};
			coll.update({
				'_id': user_id
			}, {
				'$pull': pullInfo
			}, function(err, num){});
		});
		ret = {
			'ok': 1,
			'msg': 'Remove Success'
		}
		res.send(ret);
	});
});

app.post('/do_add_record', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'Add Fail'
	}
	var ssUser = req.session.user;
	if (! ssUser) {
		res.send(ret);
		return;
	}
	var user_id = ssUser['_id'];
	
	var ccoll_name = req.query['coll'],
		values = req.body['values'];
	if (! _.isArray(values)) {
		values = [values];
	}
	
	
	coll.findOne({
		'_id': user_id,
	}, function(err, doc){
		if (err || ! doc) {
			res.send(ret);
			return;
		}
		
		// coll index
		var ccolls = doc['collections'],
			ccoll = _.where(ccolls, {
			'name': ccoll_name
		})[0];
		if (! ccoll) {
			res.send(ret);
			return;
		}
		var index = ccolls.indexOf(ccoll);
		
		
		var incInfo = {};
		incInfo[['collections', index, '_next_id'].join('.')] = 1;
		coll.findAndModify({
			'_id': user_id
		}, [], {
			'$inc': incInfo
		}, function(err, doc){
			if (err || ! doc) {
				res.send(ret);
				return;
			}
			
			// add a record
			var _id = doc['collections'][index]['_next_id'];
			values.unshift(_id);
			values.length = maxNumFields;
			var record = {};
			_.each(ccoll['fields'], function(field, i){
				record[field] = values[i];
			});
			
			var pushInfo = {};
			pushInfo[['collections', index, '_records'].join('.')] = record;
			coll.update({
				'_id': user_id
			}, {
				'$push': pushInfo
			}, function(err, num){
				if (! err && num) {
					ret = {
						'ok': 1,
						'msg': 'Add Success',
						'_id': _id
					}
				}
				res.send(ret);
			});
		});
	});
});

app.get('/do_check_coll', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'View Fail'
	}
	var ssUser = req.session.user;
	if (! ssUser) {
		res.send(ret);
		return;
	}
	var user_id = ssUser['_id'];
	
	var ccoll_name = req.query['coll'];
	coll.findOne({
		'_id': user_id,
	}, function(err, doc){
		if (! err && doc) {
			var coll = _.where(doc['collections'], {
				'name': ccoll_name
			})[0];
			if (! coll) {
				res.send(ret);
				return;
			}
			
			ret = {
				'ok': 1,
				'fields': coll['fields'],
				'_records': coll['_records']
			}
		}
		res.send(ret);
	});
});

app.post('/do_add_coll', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'Add Fail'
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
	fields = _(fields).chain().unique().filter(function(val){
		return val;
	}).value();
	fields = sysFields.concat(fields);
	if (fields.length > maxNumFields) {
		fields.length = maxNumFields;
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
					'_next_id': 1,
					'_records': []
				}
			}
		}, function(err, doc){
			if (! err && doc) {
				ret = {
					'ok': 1,
					'msg': 'Add Success'
				}
			}
			res.send(ret);
		});
	});
});

app.get('/do_check_db', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'View Fail'
	}
	var ssUser = req.session.user;
	if (! ssUser) {
		res.send(ret);
		return;
	}
	var user_id = ssUser['_id'];
	
	coll.findOne({
		'_id': user_id,
	}, function(err, doc){
		if (! err && doc) {
			// fetch colls info
			doc['_colls'] = _.map(doc['collections'], function(val, i){
				// omit the data
				return _.omit(val, '_records', '_next_id');
			});
			
			ret = {
				'ok': 1,
				'db': _.omit(doc, ['collections', 'password'])
			}
		}
		res.send(ret);
	});
});

