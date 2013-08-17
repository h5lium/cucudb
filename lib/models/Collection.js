


var _ = require('underscore');
var Model = require('../plugins/cuculibs/model/Model.js');


var Collection = Model.extend({}, function(C){
	return {
		sysFields: ['_id'],
		userFieldsMax: 4,
		
		keys: C.keys.concat(['_id', 'owner_id', 'name',
			'fields', 'summary', 'records', '_next_id']),
		validators: _.extend(C.validators, {
			name: function(val){
				return /^[a-z][a-z0-9]{3,15}$/i.test(val);
			},
			fields: function(val){
				var fields = _.difference(val, this.sysFields);	
				return fields.length <= this.userFieldsMax
				&& _.every(fields, function(val){
					return /^[a-z_][a-z0-9_]{0,11}$/i.test(val);
				});
			},
			summary: function(val){
				return /^.{0,100}$/.test(val);
			}
		}),
		fillers: _.extend(C.fillers, {
			fields: function(){
				return this.sysFields.slice();
			},
			records: function(){
				return [];
			},
			_next_id: 1
		}),
		parsers: _.extend(C.parsers, {
			fields: function(val){
				return this.sysFields.concat(
					_(val).chain().compact().uniq().value()
				);
			}
		})
	}
});


module.exports = Collection;
