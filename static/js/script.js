(function(){
	var $body = $('body'),
		$frame = $('#frame'),
		$iconbar = $('#iconbar');
	
	
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
		url = url? url: $frame.attr('data-url');
		location.hash = url;
		$iconbar.addClass('loading');
		$frame.load(url, onFrameLoad).attr('data-url', url);
	}
	_.frame.reload = function(url){
		_.frame.load();
	}
	_.frame.getURL = function(){
		return $frame.attr('data-url');
	}
	_.frame.getParam = function(key){
		var tmp = _.frame.getURL().match(/[^\?]+(.*)/);
		var search = tmp? tmp[1]: '';
		return _.getParam(key, search);
	}
	function onFrameLoad(data, status, xhr){
		if (status === 'success') {
			_.delay(function(){
				$iconbar.removeClass('loading');
			}, 300);
		}
	}
	
	
	// links
	_.frame.load(_.getHash() || '/home/');
	$body.delegate('[href]', 'click', function(ev){
		var href = $(this).attr('href');
		_.frame.load(href);
		return false;
	});
})();