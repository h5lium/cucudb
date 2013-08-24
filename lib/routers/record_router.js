


module.exports = function(app){
	var parseJSON = app.get('parseJSON');
	var record_op = require('../op/record_op.js')(app);
	
	
	// modify records
	app.post('/do/modify_records', function(req, res){
		var ssu = req.session.user,
			coll_id = Number(req.query['coll']),
			modifyInfo = parseJSON(req.body['modify_info']);
		
		record_op.modifyRecords(ssu, coll_id,
		modifyInfo, function(ret){
			res.send(ret);
		});
	});
	
	// remove records
	app.post('/do/remove_records', function(req, res){
		var ssu = req.session.user,
			coll_id = Number(req.query['coll']),
			removeInfo = parseJSON(req.body['remove_info']);
		
		record_op.removeRecords(ssu, coll_id,
		removeInfo, function(ret){
			res.send(ret);
		});
	});
	
	// add record
	app.post('/do/add_record', function(req, res){
		var ssu = req.session.user,
			coll_id = Number(req.query['coll']),
			addInfo = parseJSON(req.body['add_info']);
		
		record_op.addRecord(ssu, coll_id,
		addInfo, function(ret){
			res.send(ret);
		});
	});
}

