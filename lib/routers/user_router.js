

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
	
	// list
	app.get('/do_list_dbs', function(req, res){
		var ssu = req.session.user;
		user_op.listUsers(ssu, function(ret){
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
		var ssu = req.session.user;
		user_op.modifyUser(ssu, req.body, function(ret, userDoc){
			if (userDoc) {
				// update session
				req.session.user = userDoc;
			}
			res.send(ret);
		});
	});
}


