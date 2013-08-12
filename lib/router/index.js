
module.exports = function(app){
	// user action
	require('./user_op.js')(app);
	
	// cdb action
	require('./cdb_op.js')(app);
}


