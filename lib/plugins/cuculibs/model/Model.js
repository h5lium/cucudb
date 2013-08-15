

var _ = require('underscore'),
	Class = require('../class/Class.js');


var Model = Class.extend({
	init: function(data){
		var class_ = this.class;
		var attrs = _.pick(data, class_.keys);
		_.each(class_.keys, function(key){
			if (! (key in attrs)) {
				attrs[key] = class_.defaulters[key] ?
					class_.defaulters[key]() : undefined;
			}
		});
		this.attrs = attrs;
	},
	set: function(key, value){
		if (_.isString(key)) {
			this.attrs[key] = value;
		} else {
			// set by json
			var json = key;
			_.extend(this.attrs, json);
		}
		return this;
	},
	get: function(key){
		return _.isString(key) ? this.attrs[key] : this.attrs;
	},
	clone: function(){
		return this.class.create(_.clone(this.get()));
	}
}, {
	keys: [],
	defaulters: {},
	validators: {},
	
	create: function(data){
		return new this(data);
	},
	validate: function(data){
		var class_ = this;
		return _.isObject(data) ?
		_(data).chain().pick(class_.keys).every(function(val, key){
			var validator = class_.validators[key];
			return ! validator || validator(val);
		}).value() : true;
	}
});


module.exports = Model;
