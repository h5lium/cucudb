(function(){
    /* jQuery form-data plugin */
    $.fn.getFormData = function(){
        var json = {};
        $(this).find('[name]').each(function(i, el){
            var $el = $(el);
            if (! $el.is(':disabled') || ! $el.is(':checkbox') || $el.is(':checked')) {
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

        console.log('submit:', json);
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
})();


(function(){
    /* jQuery check-all plugin */
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
})();

