

var _ = require('underscore'),
	Class = require('../class/Class.js');


var Model = Class.extend({
	init: function(data){
		this.attrs = this.class.fill(data);
	},
	set: function(key, value){
		if (_.isString(key)) {
			this.attrs[key] = value;
		} else {
			// set by json
			_.extend(this.attrs, this.class.amend(key));
		}
		return this;
	},
	get: function(key){
		if (_.isString(key)) {
			return this.attrs[key];
		} else {
			return this.attrs;
		}
	}
}, {
	defaults: {},
	validate: function(data){
		return _.isObject(data);
	},
	fill: function(data){
		_.isObject(data) || (data = {});
		// fill
		_.each(this.defaults, function(value, key){
			if (! (key in data)) {
				data[key] = typeof value === 'function' ?
					value() : value;
			}
		});
		return data;
	},
	create: function(data){
		return new this(data);
	}
});



module.exports = Model;
