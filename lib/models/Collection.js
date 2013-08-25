


var _ = require('underscore');
var Model = require('../plugins/cuculibs/model/Model.js');


var Collection = Model.extend({}, function(C){
	return {
		sysFields: ['_id'],
		userFieldsMax: 4,
		
		regex: _.extend({}, C.regex, {
			name: /^[a-z][a-z0-9_]{0,15}$/i,
			field: /^[a-z][a-z0-9_]{0,9}$/i,
			summary: /^.{0,100}$/,
			fieldValue: /^.{0,200}$/
		}),
		
		keys: C.keys.concat(['_id', 'owner_id', 'name',
			'fields', 'summary', 'records', '_next_id']),
		validators: _.extend(C.validators, {
			name: function(val){
				return this.regex.name.test(val);
			},
			fields: function(val){
				var class_ = this;
				var fields = _.difference(val, class_.sysFields);	
				return fields.length <= class_.userFieldsMax
				&& _.every(fields, function(val){
					return class_.regex.field.test(val);
				});
			},
			summary: function(val){
				return this.regex.summary.test(val);
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
