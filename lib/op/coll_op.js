
var _ = require('underscore');
var Collection = require('../models/Collection.js');


module.exports = function(app){
	var db = app.get('db');
	var userDao = app.get('userDao'),
		collDao = app.get('collDao');
	
	var user_op = require('../op/user_op.js')(app),
		coll_op = {};
	
	
	// modify coll
	coll_op.modifyColl = function(ssu, reqBody, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		var _ids = _.map(reqBody['_id'], function(val){
			return Number(val);
		}), names = reqBody['name'],
		summaries = reqBody['summary'];
		var numColls = _ids.length;
		if (names.length !== numColls || summaries.length !== numColls) {
			ret['msg'] = 'info incorrect';
			callback(ret);
			return;
		}
		
		ret = {
			'ok': 1,
			'msg': 'modify success'
		}
		if (! numColls) {
			callback(ret);
			return;
		}
		var onModifyOne = _.after(numColls, function(err, num){
			ret['msg'] += ': '+ numFail +' failed';
			callback(ret);
		}), numFail = 0;
		_.times(numColls, function(i){
			var attrs = {
				name: names[i],
				summary: summaries[i]
			}
			if (Collection.validate(attrs)) {
				collDao.update({
					_id: _ids[i],
					owner_id: ssu._id
				}, {
					$set: attrs
				}, {}, onModifyOne);
			} else {
				numFail ++;
				onModifyOne();
			}
		});
	}
	
	// check coll
	coll_op.checkColl = function(ssu, reqQuery, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		var query = _.extend({
			_id: Number(reqQuery['coll'])
		}, ! user_op.isAdmin(ssu) && {
			owner_id: ssu._id
		});
		
		collDao.findOne(query, {}, function(err, doc){
			if (! doc) {
				callback(ret);
				return;
			}
			ret = {
				'ok': 1,
				'coll': _.pick(doc, ['name', 'fields', 'records'])
			}
			callback(ret);
		});
	}
	
	// remove colls
	coll_op.removeColls = function(ssu, reqBody, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		
		collDao.remove({
			_id: {
				$in: _.map(reqBody['selected'], function(val){
					return Number(val);
				})
			},
			owner_id: ssu._id
		}, {}, function(err, num){
			ret = {
				'ok': 1,
				'msg': 'remove success'
			}
			callback(ret);
		});
	}
	
	// add coll
	coll_op.addColl = function(ssu, reqBody, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		if (! Collection.validate(reqBody)) {
			ret['msg'] = 'info incorrect';
			callback(ret);
			return;
		}
		var coll = Collection.create(_.extend(reqBody, {
			owner_id: ssu._id
		})).get();
		
		// validate
		collDao.find(_.pick(coll, 'owner_id'), {}, function(err, docs){
			if (err || ! docs || _.some(docs, function(val){
				return ! val || val.name === coll.name;
			})) {
				callback(ret);
				return;
			}
			
			// add
			collDao.insert(coll, {}, function(err, docs){
				if (! docs[0]) {
					ret['msg'] = 'add fail';
					callback(ret);
					return;
				}
				ret = {
					'ok': 1,
					'msg': 'add success',
					'_id': docs[0]._id
				}
				callback(ret);
			});
		});
	}
	
	// check db
	coll_op.checkUser = function(ssu, reqBody, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		var query = {
			owner_id: Number(reqBody['_id']) || ssu._id
		}
		if (query.owner_id !== ssu._id && ! user_op.isAdmin(ssu)) {
			callback(ret);
			return;
		}
		
		collDao.find(query, {}, function(err, colls){
			if (! colls) {
				callback(ret);
				return;
			}
			// fetch colls info
			var _colls = _.map(colls, function(val){
				return _.omit(val, 'records');
			});
			
			ret = {
				'ok': 1,
				'db': _(ssu).chain().omit('password').extend({
					_colls: _colls
				}).value()
			}
			callback(ret);
		});
	}
	
	
	return coll_op;
}