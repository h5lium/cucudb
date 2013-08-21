
module.exports = function(app){
	// user action
	require('./user_router.js')(app);
	
	// coll action
	require('./coll_router.js')(app);
}


