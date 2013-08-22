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
		}
	}, $.getHash().substr(1) || 'home');
	$body.delegate('[href]', 'click', function(ev){
		var href = $(this).attr('href');
		$frame.path(href);
		
		// toggle back
		if ($($toggle.data('target')).is('.in')) {
			$toggle.click();
		}
		return false;
	});
	
	
	// login form
	var $form_login = $navbar.find('#form-login');
	$form_login.on('submit', function(ev){
		var $form = $(this);
		
		$.post('/do_login', $form.getFormData(), function(reply){
			$.notify(reply['msg']);
			
			if (reply['ok']) {
				$frame.path('check_db');
				$form[0].reset();
			}
		});
		
		return false;
	});
})();