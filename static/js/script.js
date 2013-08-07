(function(){
	// frame
	_.frame.config({
		$area: $('body'),
		$frame: $('#frame'),
		$loading: $('#loading'),
		route: function(url, path, query, hash){
			path = path.replace(/^\/|\/$/g, '');
			return '/html/' + path + '.html' + query + hash;
		}
	}, _.getHash() || 'home');
	
	
})();