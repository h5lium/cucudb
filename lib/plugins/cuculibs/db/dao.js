
var _ = require('underscore');

function Dao(db, collName){
	this.db = db;
	this.collName = collName;
	this._seq = null;
}

Dao.prototype.open = function(callback){
	var dao = this;
	// _seq
	dao.db.collection('_seq', function(err, _seq){
		dao._seq = _seq;
		
		_seq.count({
			_id: dao.collName
		}, function(err, count){
			if (count > 0) {
				onSeqBuilt();
			} else {
				_seq.insert({
					_id: dao.collName,
					next: 1
				}, onSeqBuilt);
			}
		});
	});
	return dao;
	function onSeqBuilt(){
		dao.db.collection(dao.collName, function(err, coll){
			dao.coll = coll;
			callback.apply(dao, [err, dao]);
		});
	}
}

Dao.prototype.find = function(selector, options, callback){
	this.coll.find(selector, options).toArray(callback);
	return this;
}
Dao.prototype.findOne = function(selector, options, callback){
	this.coll.findOne.apply(this.coll, arguments);
	return this;
}
Dao.prototype.exists = function(selector, options, callback){
	return this.findOne(selector, options, function(err, doc){
		callback(err, !! doc);
	});
}
Dao.prototype.distinct = function(key, selector, options, callback){
	this.coll.distinct.apply(this.coll, arguments);
	return this;
}
Dao.prototype.count = function(selector, options, callback){
	this.coll.count.apply(this.coll, arguments);
	return this;
}

Dao.prototype.remove = function(selector, options, callback){
	this.coll.remove.apply(this.coll, arguments);
	return this;
}
Dao.prototype.clear = function(callback){
	var dao = this;
	return dao.remove({}, {}, function(){
		dao._seq.findAndModify({
			_id: dao.collName
		}, [], {
			$set: {
				next: 1
			}
		}, {}, callback);
	});
}
Dao.prototype.incNextId = function(count, callback){ 
	var dao = this;
	dao._seq.findAndModify({
		_id: dao.collName
	}, [], {
		$inc: {
			next: count
		}
	}, {}, function(err, item){
		callback(err, item.next);
	});
	return dao;
}
Dao.prototype.update = function(selector, doc, options, callback){
	return this.coll.update.apply(this.coll, arguments);
}
Dao.prototype.findAndModify = function(selector, sort, doc, options, callback){
	return this.coll.findAndModify.apply(this.coll, arguments);
}
Dao.prototype.insert = function(docs, options, callback){
	// to array
	docs = _.isArray(docs)? docs: [docs];
	var dao = this;
	return dao.incNextId(docs.length, function(err, next){
		_.each(docs, function(doc, i){
			doc._id = next + i;
		});
		dao.coll.insert(docs, options, callback);
	});
}


module.exports = Dao;