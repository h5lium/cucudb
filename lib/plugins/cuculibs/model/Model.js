

var _ = require('underscore'),
	Class = require('../class/Class.js');


var Model = Class.extend({
	init: function(data){
		var class_ = this.class, attrs = this.attrs = {};
		this.set(data);
		_.each(class_.keys, function(key){
			if (! (key in attrs)) {
				if (key in class_.fillers) {
					var filler = class_.fillers[key];
					attrs[key] = typeof filler === 'function' ?
						filler.call(class_) : filler;
				} else {
					attrs[key] = undefined;
				}
			}
		});
	},
	set: function(data, keysPick){
		var class_ = this.class, attrs = this.attrs;
		_(data).chain().pick(
			Array.prototype.concat.apply(class_.keys, keysPick || [])
		).each(function(val, key){
			if (key in class_.parsers) {
				var parser = class_.parsers[key];
				attrs[key] = parser.call(class_, val);
			} else {
				attrs[key] = val;
			}
		});
		return this;
	},
	get: function(key){
		if (! key) {
			return this.attrs;
		} else if (_.isArray(key)) {
			var keysPick = key;
			return _.pick(this.attrs, keysPick);
		}
		return this.attrs[key];
	},
	clone: function(){
		return new this.class(_.clone(this.get()));
	}
}, {
	keys: [],
	validators: {},
	fillers: {},
	parsers: {},
	create: function(data){
		return new this(data);
	},
	validate: function(data){
		var class_ = this;
		return _.isObject(data) ?
		_(data).chain().pick(class_.keys).every(function(val, key){
			var validator = class_.validators[key];
			return ! validator || validator.call(class_, val);
		}).value() : true;
	}
});


module.exports = Model;
