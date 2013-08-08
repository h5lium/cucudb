
/* underscore & jQuery plugin: frame */
(function(){
	// detect
	if (! window._) {
		console.error('underscore.js required');
	}
	if (! window.$) {
		console.error('jquery.js required');
	}
	
	
	// page
	$.getPath = function(url){
		url = url || location.href;
		var tmp = url.match(/^([^\?]+)/);
		return tmp? tmp[1]: '';
	}
	$.getQuery = function(url){
		if (! url) {
			return location.search;
		}
		var tmp = url.match(/(\?[^#]+)/);
		return tmp? tmp[1]: '';
	}
	$.getParam = function(key, query){
		query = query || location.search;
		var tmp = query.match(new RegExp('[?&]'+ key +'=([^&]*)'));
		return tmp? tmp[1]: '';
	}
	$.getHash = function(url){
		if (! url) {
			return location.hash;
		}
		var tmp = url.match(/(#.+)$/);
		return tmp? tmp[1]: '';
	}
	$.notify = function(msg){
		alert(msg);
	}
	
	// frame
	var scope = $.frame = {};
	$.loadingFlag = function(flag){
		if (flag) {
			scope.$loading.addClass('on');
		} else {
			scope.$loading.removeClass('on');
		}
	}
	scope.route = function(href){
		return url;
	}
	scope.getHref = function(){
		return scope.$frame.attr('data-href');
	}
	scope.getParam = function(key){
		var href = scope.getHref();
		return $.getParam(key, href);
	}
	scope.load = function(href){
		// relative path only
		if (/\/\/|:\\/.test(href)) {
			console.error('illegal url denied:', href);
			return;
		}
		
		// load url
		var url = scope.route(href);
		location.hash = href;
		$.loadingFlag(true);
		scope.$frame.load(url, onFrameLoad)
			.attr('data-href', href);
	}
	scope.reload = function(){
		var href = scope.getHref();
		scope.load(href);
	}
	function onFrameLoad(data, status, xhr){
		if (status === 'success') {
			$(window).scrollTop(0);
			_.delay(function(){
				$.loadingFlag(false);
			}, 300);
		} else {
			console.error('loading fail:', scope.getHref());
		}
	}
	
	
	// config
	scope.config = function(conf, href){
		_.extend(scope, conf);
		
		// bind links
		scope.$area.delegate('[href]', 'click', function(ev){
			var href = $(this).attr('href');
			scope.load(href);
			return false;
		});
		
		// first load
		if (href) {
			scope.load(href);
		}
	}
	
	
	// loaded
	console.info('frame.js loaded');
})();
