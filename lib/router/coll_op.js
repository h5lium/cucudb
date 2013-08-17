

var _ = require('underscore');
var User = require('../models/User.js'),
	Collection = require('../models/Collection.js');


module.exports = function(app){
	var db = app.get('db');
	var userDao = app.get('userDao'),
		collDao = app.get('collDao');
	
	/*
	// remove calls
	app.post('/do_remove_colls', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'Remove Fail'
		}
		// user id
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		var user_id = ssu['_id'];
		
		// ccoll_names
		var ccoll_names = req.body['names'];
		ccoll_names = ccoll_names || [];
		
		// pull
		var target = '_collections';
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
	
	// remove records
	app.post('/do_remove_records', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'Remove Fail'
		}
		// user id
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		var user_id = ssu['_id'];
		
		// ccoll_name & record_ids
		var ccoll_name = req.query['coll'],
			record_ids = req.body['_ids'];
		record_ids = record_ids || [];
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
			var ccolls = doc['_collections'],
				ccoll = _.where(ccolls, {
				'name': ccoll_name
			})[0];
			if (! ccoll) {
				res.send(ret);
				return;
			}
			var index = ccolls.indexOf(ccoll);
			
			// pull
			var target = ['_collections', index, '_records'].join('.');
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
	
	
	// add record
	app.post('/do_add_record', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'Add Fail'
		}
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		var user_id = ssu['_id'];
		
		var ccoll_name = req.query['coll'],
			values = req.body['values'];
		values = values || [];
		
		
		coll.findOne({
			'_id': user_id,
		}, function(err, doc){
			if (err || ! doc) {
				res.send(ret);
				return;
			}
			
			// coll index
			var ccolls = doc['_collections'],
				ccoll = _.where(ccolls, {
				'name': ccoll_name
			})[0];
			if (! ccoll) {
				res.send(ret);
				return;
			}
			var index = ccolls.indexOf(ccoll);
			
			
			var incInfo = {};
			incInfo[['_collections', index, '_next_id'].join('.')] = 1;
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
				var _id = doc['_collections'][index]['_next_id'];
				values.unshift(_id);
				values.length = maxNumFields;
				var record = {};
				_.each(ccoll['fields'], function(field, i){
					record[field] = values[i];
				});
				
				var pushInfo = {};
				pushInfo[['_collections', index, '_records'].join('.')] = record;
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
	});*/
	
	// check coll
	app.get('/do_check_coll', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'view fail'
		}
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		
		var coll_id = Number(req.query['coll']);
		collDao.findOne({
			'_id': coll_id,
		}, {}, function(err, doc){
			if (err && ! doc) {
				res.send(ret);
				return;
			}
			
			ret = {
				'ok': 1,
				'coll': _.pick(doc, ['name', 'fields', 'records'])
			}
			res.send(ret);
		});
	});
	
	// add coll
	app.post('/do_add_coll', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'add fail'
		}
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		var coll = Collection.create(_.extend(req.body, {
			owner_id: ssu._id
		})).get();
		
		// validate
		collDao.find(_.pick(coll, 'owner_id'), {}, function(err, docs){
			if (err || ! docs || _.some(docs, function(val){
				return val.name === coll.name;
			})) {
				res.send(ret);
				return;
			}
			
			// add
			collDao.insert(coll, {}, function(err, docs){
				if (! err && docs.length) {
					ret = {
						'ok': 1,
						'msg': 'add success',
						'_id': docs[0]._id
					}
				}
				res.send(ret);
			});
		});
	});
	
	// check db
	app.get('/do_check_db', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'view fail'
		}
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		
		collDao.find({
			owner_id: ssu._id
		}, {}, function(err, colls){
			// fetch colls info
			var _colls = _.map(colls, function(val){
				return _.pick(val, ['_id', 'name', 'fields', 'summary']);
			});
			
			ret = {
				'ok': 1,
				'db': _(ssu).chain().pick(['_id', 'username', 'summary'])
				.extend({
					_colls: _colls
				}).value()
			}
			res.send(ret);
		});
	});
}

