

var _ = require('underscore');


module.exports = function(app){
	var user_op = require('../op/user_op.js')(app);
	
	// login
	app.post('/do_login', function(req, res){
		user_op.loginUser(req.body, function(ret, userDoc){
			if (userDoc) {
				req.session.user = userDoc;
			}
			res.send(ret);
		});
	});
	// logout
	app.post('/do_logout', function(req, res){
		req.session.user = null;
		res.send({
			'ok': 1,
			'msg': 'logout success'
		});
	});
	// get user
	app.get('/do_get_user', function(req, res){
		var ssu = req.session.user;
		res.send(ssu ? {
			'ok': 1,
			'user': _.omit(ssu, 'password')
		} : {
			'ok' : 0
		});
	});
	
	// list
	app.get('/do_list_dbs', function(req, res){
		user_op.listUsers(req.session.user, function(ret){
			res.send(ret);
		});
	});
	
	// reg
	app.post('/do_reg', function(req, res){
		user_op.registerUser(req.body, function(ret, userDoc){
			if (userDoc) {
				req.session.user = userDoc;
			}
			res.send(ret);
		});
	});
	
	// modify
	app.post('/do_modify_db', function(req, res){
		user_op.modifyUser(req.session.user, req.body,
		function(ret, userDoc){
			if (userDoc) {
				// update session
				req.session.user = userDoc;
			}
			res.send(ret);
		});
	});
}


