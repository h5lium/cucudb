
/* underscore & jQuery plugin: path */
(function(){
	// detect
	window._ || console.error('underscore.js required');
	window.$ || console.error('jquery.js required');
	
	
	// path
	$.fn.pathConfig = function(conf, href){
		return $(this).each(function(i, el){
			var $el = $(el);
			$el.data({
				pathConf: _.extend({
					router: function(href){
						return href;
					},
					callback: function(ok, content){
						ok && $el.html(content);
					},
					before: function(){},
					after: function(){}
				}, conf),
				pathHref: '',
				pathOptions: {}
			});
			
			// original href
			href && $el.path(href);
		});
	}
	$.fn.path = function(href, options){
		// relative path only
		if (/\/\/|:\\/.test(href)) {
			console.error('illegal url denied:', href);
			return;
		}
		
		return $(this).each(function(i, el){
			var $el = $(el).data('pathHref', href)
					.data('pathOptions', options);
			var conf = $el.data('pathConf');
			conf.before.apply($el);
			$.ajax(_.extend({}, options, {
				url: conf.router(href),
				success: function(content, status, xhr){
					//console.info('loaded:', href);
					conf.callback.apply($el, [true, content]);
					conf.after.apply($el);
				},
				error: function(xhr, status){
					console.error('load fail:', href);
					conf.callback.apply($el, [false]);
				}
			}));
		});
	}
	$.fn.repath = function(href, options){
		return $(this).each(function(i, el){
			var $el = $(el);
			$el.path(href || $el.data('pathHref'),
				options || $el.data('pathOptions'));
		});
	}
	
	$.fn.getParam = function(key){
		var href = $(this).data('pathHref');
		return $.getParam(key, href);
	}
	
	
	// loaded
	console.info('path.js loaded');
})();
