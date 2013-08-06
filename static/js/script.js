(function(){
	// frame
	_.frame.config({
		$scope: $('body'),
		$frame: $('#frame'),
		$loading: $('#loading')
	}, _.getHash() || '/home/');
	
	
})();