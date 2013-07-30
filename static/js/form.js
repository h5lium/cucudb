(function(){
    /* jQuery form plugin */
    
    /*$.fn.getFormData = function(){
        var json = {};
        var serialized = $(this).serialize();
        var segs = serialized? serialized.split('&'): [];
        _.each(segs, function(seg, i){
            var tmp = seg.split('=');
            var key = tmp[0], value = decodeURIComponent(tmp[1]);
            if (! _.has(json, key)) {
                json[key] = value;
            } else {
                if (! _.isArray(json[key])) {
                    json[key] = [json[key]];    // changed into Array
                }
                json[key].push(value);
            }
        });
        return json;
    }*/

    // unstable
    $.fn.getFormData = function(){
        var json = {};
        $(this).find('[name]').each(function(i, el){
            var $el = $(el);
            if (! $el.is(':checkbox') || $el.is(':checked')) {
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