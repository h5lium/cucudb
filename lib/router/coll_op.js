

var _ = require('underscore');
var User = require('../models/User.js'),
	Collection = require('../models/Collection.js');


module.exports = function(app){
	var db = app.get('db');
	var userDao = app.get('userDao'),
		collDao = app.get('collDao');
	
	
	// update records
	
	
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
	});*/
	
	// remove records
	app.post('/do_remove_records', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'remove fail'
		}
		// user id
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		
		collDao.update({
			_id: Number(req.query['coll']),
			owner_id: ssu._id
		}, {
			$pull: {
				records: {
					_id: {
						$in: _.map(req.body['_ids'], function(val){
							return Number(val);
						})
					}
				}
			}
		}, {}, function(err, num){
			if (err || ! num) {
				res.send(ret);
				return;
			}
			
			ret = {
				'ok': 1,
				'msg': 'remove success'
			}
			res.send(ret);
		});
	});
	
	// add record
	app.post('/do_add_record', function(req, res){
		var ret = {
			'ok': 0,
			'msg': 'add fail'
		}
		var ssu = req.session.user;
		if (! ssu) {
			res.send(ret);
			return;
		}
		
		collDao.findAndModify({
			_id: Number(req.query['coll']),
			owner_id: ssu._id
		}, [], {
			$inc: {
				_next_id: 1
			}
		}, {}, function(err, doc){
			if (err || ! doc) {
				res.send(ret);
				return;
			}
			var _next_id = doc._next_id;
			var record = _(req.body).chain().pick(doc.fields).extend({
				_id: _next_id
			}).value();
			
			collDao.update({
				_id: doc._id
			}, {
				$push: {
					records: record
				}
			}, {}, function(err, num){
				if (err || ! num) {
					res.send(ret);
					return;
				}
				
				ret = {
					'ok': 1,
					'msg': 'add success',
					'_id': _next_id
				}
				res.send(ret);
			});
		});
	});
	
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
		
		collDao.findOne({
			_id: Number(req.query['coll']),
			owner_id: ssu._id
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

