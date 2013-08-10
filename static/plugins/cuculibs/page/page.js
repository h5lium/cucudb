(function(){
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
	
})();
