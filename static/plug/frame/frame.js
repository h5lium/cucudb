
/* underscore & jQuery plugin: frame */
(function(){
	// detect
	if (! window._) {
		console.error('underscore.js required');
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
	
	_.frame = {};
	_.frame.notify = function(msg){
		alert(msg);
	}
	_.frame.load = function(url){
		url = url? url: _.frame.$frame.attr('data-url');
		location.hash = url;
		_.frame.$loading.addClass('on');
		_.frame.$frame.load(url, onFrameLoad).attr('data-url', url);
	}
	_.frame.reload = function(url){
		_.frame.load();
	}
	_.frame.getURL = function(){
		return _.frame.$frame.attr('data-url');
	}
	_.frame.getParam = function(key){
		var tmp = _.frame.getURL().match(/[^\?]+(.*)/);
		var search = tmp? tmp[1]: '';
		return _.getParam(key, search);
	}
	function onFrameLoad(data, status, xhr){
		if (status === 'success') {
			_.delay(function(){
				_.frame.$loading.removeClass('on');
			}, 300);
		}
	}
	
	
	// config
	_.frame.config = function(conf, url){
		_.extend(_.frame, conf);
		
		// bind links
		_.frame.$scope.delegate('[href]', 'click', function(ev){
			var href = $(this).attr('href');
			_.frame.load(href);
			return false;
		});
		
		// first load
		_.frame.load(url);
	}
	
	
	// loaded
	console.info('frame.js loaded');
})();
