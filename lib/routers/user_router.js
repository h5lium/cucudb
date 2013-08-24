

var _ = require('underscore');


module.exports = function(app){
	var parseJSON = app.get('parseJSON');
	var user_op = require('../op/user_op.js')(app);
	
	// login
	app.post('/do/login', function(req, res){
		var loginInfo = parseJSON(req.body['login_info']);
		
		user_op.loginUser(loginInfo, function(ret, userDoc){
			if (userDoc) {
				req.session.user = userDoc;
			}
			res.send(ret);
		});
	});
	// logout
	app.post('/do/logout', function(req, res){
		req.session.user = null;
		res.send({
			'ok': 1,
			'msg': 'logout success'
		});
	});
	// get user
	app.get('/do/get_user', function(req, res){
		var ssu = req.session.user;
		res.send(ssu ? {
			'ok': 1,
			'user': _.omit(ssu, 'password')
		} : {
			'ok' : 0
		});
	});
	
	// list
	app.get('/do/list_dbs', function(req, res){
		var ssu = req.session.user;
		
		user_op.listUsers(ssu, function(ret){
			res.send(ret);
		});
	});
	
	// reg
	app.post('/do/reg', function(req, res){
		var regInfo = parseJSON(req.body['reg_info']);
		
		user_op.registerUser(regInfo, function(ret, userDoc){
			if (userDoc) {
				req.session.user = userDoc;
			}
			res.send(ret);
		});
	});
	
	// modify
	app.post('/do/modify_db', function(req, res){
		var ssu = req.session.user,
			modifyInfo = parseJSON(req.body['modify_info']);
		
		user_op.modifyUser(ssu, modifyInfo,
		function(ret, userDoc){
			if (userDoc) {
				// update session
				req.session.user = userDoc;
			}
			res.send(ret);
		});
	});
}


