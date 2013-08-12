
var _ = require('underscore');


function User(data){
	this.attrs = User.parse(data);
}
User.keys = ['username', 'password', 'summary', '_collections'];
User.extenders = {
	// all keys
	username: function(){
		var rndLetter = function(){
			// a-z
			return String.fromCharCode(_.random(97, 122));
		}
		var str = '';
		_.times(4, function(){
			str += rndLetter();
		});
		return str;
	},
	password: function(){
		return '123456';
	},
	summary: function(){
		return '';
	},
	_collections: function(){
		return [];
	}
}
User.validators = {
	username: function(val){
		// * 4~16 bits, letters or nums, led by a letter
		return _.isString(val) && /^[a-z][a-z0-9]{3,15}$/i.test(val);
	},
	password: function(val){
		// * 6~20 bits, all kinds of semiangle char, case sensitive
		return _.isString(val) && /^[\x00-\xff]{6,20}$/.test(val);
	},
	summary: function(val){
		// 0~100 bits
		return _.isString(val) && /^.{0,100}$/.test(val);
	}
}
User.parse = function(data){
	// clone
	var attrs = _.isObject(data)? _.clone(data): {};
	// pick
	attrs = _.pick(attrs, User.keys);
	// extend
	_.each(User.extenders, function(factory, key){
		if (! (key in attrs)) {
			attrs[key] = factory();
		}
	});
	return attrs;
}
User.validate = function(attrs){
	return _.every(attrs, function(val, key){
		var validator = User.validators[key];
		return ! validator || validator(val);
	});
}

User.prototype.attr = function(key, val){
	if (arguments.length > 1) {
		this.attrs[key] = val;
		return this;
	} else {
		return this.attrs[key];
	}
}



module.exports = User;