
module.exports = function(app){
	app.set('parseJSON', function(str){
		var data;
		try {
			data = JSON.parse(str);
		} catch (err) {
			data = {};
		}
		return data;
	});
	
	// user action
	require('./user_router.js')(app);
	
	// coll action
	require('./coll_router.js')(app);
	
	// record action
	require('./record_router.js')(app);
}


