


module.exports = function(app){
	var record_op = require('../op/record_op.js')(app);
	
	
	// modify records
	app.post('/do_modify_records', function(req, res){
		record_op.modifyRecords(req.session.user,
		req.query, req.body, function(ret){
			res.send(ret);
		});
	});
	
	// remove records
	app.post('/do_remove_records', function(req, res){
		record_op.removeRecords(req.session.user,
		req.query, req.body, function(ret){
			res.send(ret);
		});
	});
	
	// add record
	app.post('/do_add_record', function(req, res){
		record_op.addRecord(req.session.user,
		req.query, req.body, function(ret){
			res.send(ret);
		});
	});
}

