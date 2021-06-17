var colors = require('colors');
if (!process.env.ARROWDB_APPKEY) {
	console.error('Please create an ArrowDB app and set environment vars for ARROWDB_APPKEY'.red);
	process.exit(1);
}

var ArrowDB = require('../lib/arrowdb');

console.log('Creating ArrowDB app instance...'.cyan);
var arrowDBApp = new ArrowDB(process.env.ARROWDB_APPKEY);
console.log('Created: '.cyan + '%j', arrowDBApp);



console.log('User creating...'.cyan);
arrowDBApp.userCreate({
		'_login': 'paul',
		'_password': 'cocoafish',
		//'_admin_': true,
}, function(err, result) {
	if (err) {
		console.error(err);
		return;
	}
	console.log('User create request finished: '.cyan + '%j', result.body);
	console.log('User logging in...'.cyan);
	arrowDBApp.userLogin({
		login: 'paul',
		password: 'cocoafish'
	}, function(err, result) {
	if (err) {
		console.error(err);
	return;
	}
	console.log('User login request finished: '.cyan + '%j', result.body);
	});	
});



