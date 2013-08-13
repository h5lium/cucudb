
module.exports = function(app){
	// user action
	require('./user_op.js')(app);
	
	// coll action
	require('./coll_op.js')(app);
}


