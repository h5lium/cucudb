(function(){
	// frame
	$.frame.config({
		$area: $('body'),
		$frame: $('#frame'),
		$loading: $('#loading'),
		route: function(url){
			var path = $.getPath(url),
				query = $.getQuery(url),
				hash = $.getHash(url);
			var url = '/frames/' + path + '.html' + query + hash;
			return url;
		}
	}, $.getHash().substr(1) || 'home');
	
	
})();