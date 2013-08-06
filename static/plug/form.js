
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
        $(this).find('[name]').each(function(i, el){
            var $el = $(el);
            if (! $el.is(':disabled') && ! $el.is(':checkbox') || $el.is(':checked')) {
                var key = $el.attr('name'),
                    value = $el.val();
                if (! _.has(json, key)) {
                    json[key] = value;
                } else {
                    if (! _.isArray(json[key])) {
                        json[key] = [json[key]];    // changed into Array
                    }
                    json[key].push(value);
                }
            }
        });
		
        console.info('submit:', json);
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
    function onChange(ev){
        var $this = $(this);
        var $group = $this.closest('form').find('input[name="'+ $this.data('name') +'"]');

        $group.each(function(i, el){
            el.checked = $this.is(':checked');
        });
    }
    
    $(function(){
        $('body').delegate('input.check-all', 'change', onChange);
    });
    
    
    // loaded
    console.info('form.js loaded');
})();

