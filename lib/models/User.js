

var _ = require('underscore');
var UserBase = require('../plugins/cuculibs/model/User.js');


var User = UserBase.extend({}, function(C){
	return {
		keys: C.keys.concat(['summary', 'collections']),
		validators: _.extend({}, C.validators, {
			summary: function(val){
				return /^.{0,100}$/.test(val);
			}
		}),
		fillers: _.extend({}, C.fillers, {}),
		parsers: _.extend({}, C.parsers, {})
	}
});


module.exports = User;