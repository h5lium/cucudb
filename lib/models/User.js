

var _ = require('underscore');
var Model = require('../plugins/cuculibs/model/Model.js');


var User = Model.extend({}, function(C){
	return {
		keys: ['_id', 'username', 'password', 'summary', 'collections'],
		validators: _.extend(C.validators, {
			username: function(val){
				return /^[a-z][a-z0-9]{3,15}$/.test(val);
			},
			password: function(val){
				return /^[\x00-\xff]{6,20}$/.test(val);
			},
			summary: function(val){
				return /^.{0,100}$/.test(val);
			}
		}),
		fillers: _.extend(C.fillers, {
			collections: function(){
				return [];
			}
		}),
		parsers: _.extend(C.parsers, {
			username: function(val){
				return _.isString(val) ? val.toLowerCase() : val;
			}
		})
	}
});


module.exports = User;