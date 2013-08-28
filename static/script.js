var $body = $('body'),
	$frame = $('#frame'),
	$navbar = $('.navbar'),
	$toggle = $('.navbar').find('.navbar-toggle'),
	$nav = $navbar.find('.navbar-nav');


(function(){
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
			// scroll top
			$(window).scrollTop(0);
		}
	}, $.getHash().substr(1) || 'home');
	// href click
	$body.delegate('[href]', 'click', function(ev){
		var href = $(this).attr('href');
		if ($(this).is('.external')) {
			window.open(href);
			return false;
		} else if ($(this).is('.anchor')) {
			return true;
		} else {
			$frame.path(href);
			return false;
		}
	});
	// hash change
	$(window).on('hashchange', function(){
		var href = $.getHash().substr(1);
		href !== $frame.data('pathHref') && $frame.path(href);
		return false;
	});
	
	
	// login form
	var $form_login = $navbar.find('#form-login');
	$form_login.on('submit', function(ev){
		var $form = $(this);
		
		$.post('/do/login', {
			'login_info': $form.getFormString(),
		}, function(reply){
			$.notify(reply['msg']);
			
			if (reply['ok']) {
				$frame.path('check_db');
				getUser();
				$form[0].reset();
			}
		});
		
		return false;
	});
	// logout form
	var $form_logout = $navbar.find('#form-logout'),
		$span_username = $form_logout.find('#span-username');
	$form_logout.on('submit', function(ev){
		var $form = $(this);
		
		$.post('/do/logout', $form.getFormData(), function(reply){
			$.notify(reply['msg']);
			
			if (reply['ok']) {
				$frame.path('home');
				getUser();
				$span_username.empty();
			}
		});
		
		return false;
	});
	// get user
	getUser();
	function getUser(){
		$.get('/do/get_user', function(reply){
			if (reply['ok']) {
				$span_username.text(reply['user'].username);
				$form_login.addClass('hidden');
				$form_logout.removeClass('hidden');
			} else {
				$form_logout.addClass('hidden');
				$form_login.removeClass('hidden');
			}
		});
	}
})();