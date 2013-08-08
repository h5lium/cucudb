
/* underscore & jQuery plugin: form-data */
(function(){
	// detect
	if (! window._) {
		console.error('underscore.js required');
	}
	if (! window.$) {
		console.error('jquery.js required');
	}
	
	
	// form-data
	$.fn.getFormData = function(){
		var json = {};
		$(this).find('[name]:not(:disabled)').each(function(i, el){
			var $el = $(el);
			var key = $el.attr('name');
			if (/\[\]$/.test(key)) {
				// defined as array
				key = key.replace(/\[\]$/, '');
				if (! json[key]) {
					json[key] = [];
				}
			}
			// notice: value goes `undefined` on server when submitted as `[]`
			
			if (! $el.is(':checkbox') || $el.is(':checked')) {
				var value = $el.val();
				
				if (_.isArray(json[key])) {
					json[key].push(value);
				} else {
					json[key] = value;
				}
			}
		});
		
		// debug
		//console.info('submit:', json);
		return json;
	}
	$(function(){
		// prevent all form default behaviors
		$('body').delegate('form', 'submit', function(ev){
			ev.preventDefault();

			// clear check-all
			var $check_all = $(this).find('.check-all');
			$check_all.each(function(i, el){
				el.checked = false;
			});
		});
	});
	
	
	// check-all
	$.fn.checkAll = function(checked){
		return $(this).each(function(i, el){
			var $el = $(el);
			var $group = $el.closest('form').find('input[name="'+ $el.data('name') +'"]');
			
			el.checked = checked;
			$group.each(function(i, el){
				el.checked = checked;
			});
		});
	}
	function onChange(ev){
		$(this).checkAll($(this).is(':checked'));
	}
	$(function(){
		$('body').delegate('input.check-all', 'change', onChange);
	});
	
	
	// loaded
	console.info('form.js loaded');
})();

