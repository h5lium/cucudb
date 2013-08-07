
/* underscore & jQuery plugin: frame */
(function(){
	// detect
	if (! window._) {
		console.error('underscore.js required');
	}
	if (! window.$) {
		console.error('jquery.js required');
	}
	
	
	// utils
	_.getParam = function(key, search){
		search = search || location.search;
		var tmp = search.match(new RegExp('[?&]'+ key +'=([^&]*)'));
		return tmp? tmp[1]: '';
	}
	_.getHash = function(){
		return location.hash.substr(1);
	}
	
	var scope = _.frame = {};
	scope.notify = function(msg){
		alert(msg);
	}
	scope.load = function(url){
		// relative path only
		if (/\/\/|:\\/.test(url)) {
			console.error('illegal url denied:', url);
			return;
		}
		
		// load url
		location.hash = url;
		scope.$loading.addClass('on');
		scope.$frame.load(url, onFrameLoad).attr('data-url', url);
	}
	scope.reload = function(){
		var url = scope.$frame.attr('data-url');
		scope.load(url);
	}
	scope.getURL = function(){
		return scope.$frame.attr('data-url');
	}
	scope.getParam = function(key){
		var tmp = scope.getURL().match(/[^\?]+(.*)/);
		var search = tmp? tmp[1]: '';
		return _.getParam(key, search);
	}
	function onFrameLoad(data, status, xhr){
		if (status === 'success') {
			_.delay(function(){
				scope.$loading.removeClass('on');
			}, 300);
		} else {
			console.error('loading fail:', scope.getURL());
		}
	}
	
	
	// config
	scope.config = function(conf, url){
		_.extend(scope, conf);
		
		// bind links
		scope.$area.delegate('[href]', 'click', function(ev){
			var href = $(this).attr('href');
			scope.load(href);
			return false;
		});
		
		// first load
		scope.load(url);
	}
	
	
	// loaded
	console.info('frame.js loaded');
})();
