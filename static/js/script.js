(function(){
	// frame
	_.frame.config({
		$area: $('body'),
		$frame: $('#frame'),
		$loading: $('#loading')
	}, _.getHash() || '/home/');
	
	
})();