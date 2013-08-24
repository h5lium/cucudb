

module.exports = function(app){
	var parseJSON = app.get('parseJSON');
	var coll_op = require('../op/coll_op.js')(app);
	
	
	// modify colls
	app.post('/do/modify_colls', function(req, res){
		var ssu = req.session.user,
			modifyInfo = parseJSON(req.body['modify_info']);
		
		coll_op.modifyColl(ssu, modifyInfo, function(ret){
			res.send(ret);
		});
	});
	
	// check coll
	app.get('/do/check_coll', function(req, res){
		var ssu = req.session.user,
			coll_id = Number(req.query['coll']);
		
		coll_op.checkColl(ssu, coll_id, function(ret){
			res.send(ret);
		});
	});
	
	// remove calls
	app.post('/do/remove_colls', function(req, res){
		var ssu = req.session.user,
			removeInfo = parseJSON(req.body['remove_info']);
		
		coll_op.removeColls(ssu, removeInfo, function(ret){
			res.send(ret);
		});
	});
	
	// add coll
	app.post('/do/add_coll', function(req, res){
		var ssu = req.session.user,
			addInfo = parseJSON(req.body['add_info']);
		
		coll_op.addColl(ssu, addInfo, function(ret){
			res.send(ret);
		});
	});
	
	// check db
	app.get('/do/check_db', function(req, res){
		var ssu = req.session.user,
			target_id = Number(req.query['_id']);
		
		coll_op.checkUser(ssu, target_id, function(ret){
			res.send(ret);
		});
	});
}

