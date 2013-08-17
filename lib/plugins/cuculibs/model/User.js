

var _ = require('underscore');
var Model = require('./Model.js');


var User = Model.extend({}, function(C){
	return {
		keys: C.keys.concat(['_id', 'username', 'password']),
		validators: _.extend({}, C.validators, {
			username: function(val){
				return /^[a-z][a-z0-9]{3,15}$/i.test(val);
			},
			password: function(val){
				return /^[\x00-\xff]{6,20}$/.test(val);
			}
		}),
		fillers: _.extend({}, C.fillers, {}),
		parsers: _.extend({}, C.parsers, {
			username: function(val){
				return _.isString(val) ? val.toLowerCase() : val;
			}
		})
	}
});


module.exports = User;