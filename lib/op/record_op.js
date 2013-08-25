
var _ = require('underscore');
var Collection = require('../models/Collection.js');


module.exports = function(app){
	var parseJSON = app.get('parseJSON');
	var userDao = app.get('userDao'),
		collDao = app.get('collDao');
	
	var user_op = require('../op/user_op.js')(app),
		coll_op = require('../op/coll_op.js')(app),
		record_op = {};
	
	
	// modify records
	record_op.modifyRecords = function(ssu, coll_id,
	modifyInfo, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		
		collDao.findOne({
			_id: coll_id,
			owner_id: ssu._id
		}, {}, function(err, doc){
			if (! doc) {
				callback(ret);
				return;
			}
			var records = doc.records,
			_ids = _.map(modifyInfo['_id'], function(val){
				return Number(val);
			}), numRecords = _ids.length;
			var numColls = _ids.length,
				numFailed = 0;
			
			_.times(numRecords, function(i){
				var record = _.findWhere(records, {
					_id: _ids[i]
				});
				if (record) {
					_.each(record, function(val, field){
						if (modifyInfo[field].length !== numColls) {
							ret['msg'] = 'info incorrect';
							callback(ret);
							return;
						}
						
						if (! _.contains(Collection.sysFields, field)) {
							var value = modifyInfo[field][i];
							if (Collection.regex.fieldValue.test(value)) {
								record[field] = value;
							} else {
								numFailed ++;
							}
						}
					});
				}
			});
			
			collDao.update({
				_id: doc._id
			}, {
				$set: {
					records: records
				}
			}, {}, function(err, num){
				ret = {
					'ok': 1,
					'msg': 'modify success: '+ numFailed + ' failed'
				}
				callback(ret);
			});
		});
	}
	
	// remove records
	record_op.removeRecords = function(ssu, coll_id,
	removeInfo, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		
		collDao.update({
			_id: coll_id,
			owner_id: ssu._id
		}, {
			$pull: {
				records: {
					_id: {
						$in: _.map(removeInfo['selected'], function(val){
							return Number(val);
						})
					}
				}
			}
		}, {}, function(err, num){
			ret = {
				'ok': 1,
				'msg': 'remove success'
			}
			callback(ret);
		});
	}
	
	// add record
	record_op.addRecord = function(ssu, coll_id,
	addInfo, callback){
		var ret = {
			'ok': 0,
			'msg': 'permission denied'
		}
		if (! ssu) {
			callback(ret);
			return;
		}
		
		collDao.findAndModify({
			_id: coll_id,
			owner_id: ssu._id
		}, [], {
			$inc: {
				_next_id: 1
			}
		}, {}, function(err, doc){
			if (! doc) {
				callback(ret);
				return;
			}
			if (_.some(addInfo, function(val){
				return ! val;
			})) {
				ret['msg'] = 'info incorrect';
				callback(ret);
				return;
			}
			addInfo = _.pick(addInfo, doc.fields);
			// validate
			if (! _.every(addInfo, function(val){
				return Collection.regex.fieldValue.test(val);
			})) {
				ret['msg'] = 'value over range';
				callback(ret);
				return;
			}
			
			var record = _.extend(addInfo, {
				_id: doc._next_id
			});
			collDao.update({
				_id: doc._id
			}, {
				$push: {
					records: record
				}
			}, {}, function(err, num){
				if (! num) {
					ret['msg'] = 'add fail';
					callback(ret);
					return;
				}
				ret = {
					'ok': 1,
					'msg': 'add success',
					'_id': record._id
				}
				callback(ret);
			});
		});
	}
	
	
	return record_op;
}