

module.exports = function(app){
	var coll_op = require('../op/coll_op.js')(app);
	
	
	// modify colls
	app.post('/do_modify_colls', function(req, res){
		coll_op.modifyColl(req.session.user,
		req.body, function(ret){
			res.send(ret);
		});
	});
	
	// check coll
	app.get('/do_check_coll', function(req, res){
		coll_op.checkColl(req.session.user,
		req.query, function(ret){
			res.send(ret);
		});
	});
	
	// remove calls
	app.post('/do_remove_colls', function(req, res){
		coll_op.removeColls(req.session.user,
		req.body, function(ret){
			res.send(ret);
		});
	});
	
	// add coll
	app.post('/do_add_coll', function(req, res){
		coll_op.addColl(req.session.user,
		req.body, function(ret){
			res.send(ret);
		});
	});
	
	// check db
	app.get('/do_check_db', function(req, res){
		coll_op.checkUser(req.session.user,
		req.body, function(ret){
			res.send(ret);
		});
	});
}

