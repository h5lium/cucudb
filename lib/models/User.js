

var _ = require('underscore');
var Model = require('../plugins/cuculibs/model/Model.js');


var User = Model.extend({
	init: function(data){
		this._super(data);
	}
}, {
	keys: ['_id', 'username', 'password', 'summary', 'collections'],
	defaulters: {
		collections: function(){
			return [];
		}
	},
	validators: {
		username: function(val){
			return /^[a-z][a-z0-9]{3,15}$/.test(val);
		},
		password: function(val){
			return /^[\x00-\xff]{6,20}$/.test(val);
		},
		summary: function(val){
			return /^.{0,100}$/.test(val);
		}
	}
});


module.exports = User;