

var _ = require('underscore');
var UserBase = require('../plugins/cuculibs/model/User.js');


var User = UserBase.extend({}, function(C){
	return {
		regex: _.extend({}, C.regex, {
			summary: /^.{0,100}$/
		}),
		
		keys: C.keys.concat(['summary', 'collections']),
		validators: _.extend({}, C.validators, {
			summary: function(val){
				return this.regex.summary.test(val);
			}
		}),
		fillers: _.extend({}, C.fillers, {}),
		parsers: _.extend({}, C.parsers, {})
	}
});


module.exports = User;