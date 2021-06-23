var colors = require('colors');
if (!process.env.ARROWDB_APPKEY) {
	console.error('Please create an ArrowDB app and set environment vars for ARROWDB_APPKEY'.red);
	process.exit(1);
}

var ArrowDB = require('../lib/arrowdb');

var userID = '';

console.log('Creating ArrowDB app instance...'.cyan);
var arrowDBApp = new ArrowDB(process.env.ARROWDB_APPKEY,{
	autoSessionManagement: false
});
console.log('Created: '.cyan + '%j', arrowDBApp);

//arrowDBApp.sessionCookieString = '70197033f58ccbb704556773308d3b68';

console.log('User creating...'.cyan);
arrowDBApp.user({
		'_login': 'paul2',
		'_password': 'cocoafish2',
		//'_admin_': true,
}, function(err, resultCreate) {
	if (err) {
		console.error(err);
		return;
	}
	console.log('User create request finished: '.cyan + '%j', resultCreate.body);
	console.log('User logging in...'.cyan);
	var obj = JSON.parse(JSON.stringify(resultCreate.body));
	userID = obj.response.data[0]._id;
	arrowDBApp.userLogin({
		login: 'paul2',
		password: 'cocoafish2'
	}, function(err, result) {
		if (err) {
			console.error(err);
		return;
		}
		console.log('User login request finished: '.cyan + '%j', result.body);
		arrowDBApp.userDelete({
			'user_id': userID
		}, function(err, result) {
			if (err) {
				console.error(err);
			return;
			}
			console.log('User delete request finished: '.cyan + '%j', result.body);
		});	
	});	
 });
