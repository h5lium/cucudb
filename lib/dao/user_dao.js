
var _ = require('underscore');
var Dao = require('../plugins/cuculibs/db/dao.js');
var std = require('../../config/user_std.js');

function UserDao(db){
	Dao.apply(this, [db, 'users']);
}
UserDao.prototype = Object.create(Dao.prototype);



/*
 * check standard with regex, sync
 * all strings from form
 */
UserDao.prototype.checkStandard = function(doc){
	if (_.some(std, function(val, key){
		return ! val[0].test(doc[key]);
	})) {
		return false;
	}
	return true;
}
/*
 * parse: some convertions, clone
 */
UserDao.prototype.parse = function(doc){
	return _.clone(doc);
}
/*
 * check with db, async
 */
UserDao.prototype.checkConflict = function(doc, callback){
	return this.exists({
		username: doc.username
	}, {}, function(err, exists){
		if (exists) {
			callback(err, false);
		} else {
			callback(err, true);
		}
	});
}
/*
 * checkStandard -> parse -> checkConflict
 */
UserDao.prototype.validate = function(doc, callback){
	if (! this.checkStandard(doc)) {
		callback(null, false);
		return this;
	}
	return this.checkConflict(this.parse(doc), callback);
}



// work with requests





module.exports = UserDao;