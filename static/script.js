var $body = $('body'),
	$frame = $('#frame'),
	//$loading = $('#loading'),
	$navbar = $('.navbar'),
	$toggle = $('.navbar').find('.navbar-toggle'),
	$nav = $navbar.find('.navbar-nav');


(function(){
	// loading
	/*$(document).ajaxStart(function(){
		$loading.addClass('on');
	}).ajaxStop(function(){
		_.delay(function(){
			$loading.removeClass('on');
		}, 300);
	});*/
	
	
	// path
	$frame.pathConfig({
		router: function(href){
			var path = $.getPath(href),
				query = $.getQuery(href),
				hash = $.getHash(href);
			return '/frames/' + path + '.html' + query + hash;
		},
		before: function(){
			var href = $(this).data('pathHref');
			location.hash = href;
			
			// navbar active
			$nav.find('li').removeClass('active')
				.has('[href="'+ href +'"]').addClass('active');
			// toggle back
			if ($($toggle.data('target')).is('.in')) {
				$toggle.click();
			}
		}
	}, $.getHash().substr(1) || 'home');
	$body.delegate('[href]', 'click', function(ev){
		var href = $(this).attr('href');
		$frame.path(href);
		return false;
	});
})();