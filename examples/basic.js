var colors = require('colors');
if (!process.env.ARROWDB_APPKEY) {
	console.error('Please create an ArrowDB app and set environment vars for ARROWDB_APPKEY'.red);
	process.exit(1);
}

var ArrowDB = require('../lib/arrowdb');

var userID = '';

console.log('Creating ArrowDB app instance...'.cyan);
var arrowDBApp = new ArrowDB(process.env.ARROWDB_APPKEY, {
    autoSessionManagement: false
});
console.log('Created: '.cyan + '%j', arrowDBApp);
 var arrowDBApp2 = new ArrowDB(process.env.ARROWDB_APPKEY, {
    autoSessionManagement: false
});
arrowDBApp.sessionCookieString = '70197033f58ccbb704556773308d3b68';
arrowDBApp2.sessionCookieString = '70197033f58ccbb704556773308d3b68';

console.log('User creating...'.cyan);
arrowDBApp.userCreate({
		'_login': 'paul2',
		'_password': 'cocoafish2',
		//'_admin_': true,
}, function(err, resultCreate) {
	if (err) {
		console.error(err);
		return;
	}
	console.log('User create request finished: '.cyan + '%j', resultCreate.body);
	console.log('User logging in using SDK method...'.cyan);
	var obj = JSON.parse(JSON.stringify(resultCreate.body));
	userID = obj.response.data[0]._id;

	arrowDBApp.userLogin({
		login: 'paul2',
		password: 'cocoafish2'
	}, function(err, resultLogin) {
		if (err) {
			console.error(err);
			return;
		}
		console.log('User login request using SDK method finished: '.cyan + '%j', resultLogin.body);
		console.log('User logging in using REST API method: '.cyan);
		arrowDBApp2.get('/v2/user/login?login=paul2&password=cocoafish2', {},function(err, resultLoginREST) {
			if (err) {
				console.error(err);
				return;
			}	
			console.log('User login request using REST API method finished: '.cyan + '%j', resultLoginREST.body);
			console.log('Cookie string returned: %s', resultLoginREST.cookieString);

			arrowDBApp.userDelete({
				'user_id': userID
			}, function(err, resultDelete) {
				if (err) {
					console.error(err);
					return;
				}
				console.log('User delete request finished: '.cyan + '%j', resultDelete.body);
			});	
		});
	});	
 });

