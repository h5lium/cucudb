
module.exports = function(app){
	// user action
	require('./user.js')(app);
	
	// cdb action
	require('./cdb.js')(app);
}


