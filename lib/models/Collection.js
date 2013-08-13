


var _ = require('underscore');
var Model = require('../plugins/cuculibs/model/Model.js');


var Collection = Model.extend({
	init: function(data){
		this._super(data);
	}
}, {
	defaults: {
		_id: function(){
			return _.random(1, 1024);
		},
		name: function(){
			var str = '';
			_.times(8, function(){
				str += String.fromCharCode(_.random(97, 122));
			});
			return str;
		},
		fields: function(){
			// sys-field `_id`
			return ['_id'];
		},
		summary: '',
		records: function(){
			return [];
		}
	},
	validate: function(data){
		/* validate items only given */
		if (! this._super(data)) return false;
		if (('name' in data)
		&& ! /^[a-z][a-z0-9]{3,15}$/i.test(data.name)) {
			// * 4~16 bits, letters or nums, led by a letter
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


module.exports = Collection;
