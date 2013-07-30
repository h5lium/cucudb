

// global
var app = global.app,
	mongo = global.mongo,
	_ = global._;

// db & collection init
var db = mongo.db(global.appName),
	collName = 'user_list',
	coll = db.collection(collName);



// router
app.get('/do_check_user', function(req, res){
	var ret = {
		'ok': 0,
		'msg': 'View Fail'
	}
	var user_id = req.query['_id']? Number(req.query['_id']): -1;
	
	coll.findOne({
		'_id': user_id,
	}, function(err, doc){
		if (! err && doc) {
			// fetch colls info
			doc['_colls'] = _.map(doc['collections'], function(val, i){
				// omit the data
				return _.omit(val, '_data');
			});
			delete doc['collections'];
			
			ret = {
				'ok': 1,
				'user': doc
			}
		}
		res.send(ret);
	});
});

