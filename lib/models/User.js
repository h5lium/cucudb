

var _ = require('underscore');
var Model = require('../plugins/cuculibs/model/Model.js');


var User = Model.extend({
	init: function(data){
		this._super(data);
	}
}, {
	defaults: {
		_id: function(){
			return _.random(1, 64);
		},
		username: function(){
			var str = '';
			_.times(4, function(){
				str += String.fromCharCode(_.random(97, 122));
			});
			return str;
		},
		password: '123456',
		summary: '',
		collections: function(){
			return [];
		}
	},
	validate: function(data){
		/* validate items only given */
		if (! this._super(data)) return false;
		if (('username' in data)
		&& ! /^[a-z][a-z0-9]{3,15}$/i.test(data.username)) {
			// * 4~16 bits, letters or nums, led by a letter
			return false;
		}
		if (('password' in data)
		&& ! /^[\x00-\xff]{6,20}$/i.test(data.password)) {
			// * 6~20 bits, semiangle chars, case sensitive
			return false;
		}
		if (('summary' in data)
		&& ! /^.{0,100}$/i.test(data.summary)) {
			// 0~100 bits
			return false;
		}
		return true;
	}
});


module.exports = User;