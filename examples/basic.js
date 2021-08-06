var colors = require('colors');
if (!process.env.ARROWDB_APPKEY) {
	console.error('Please create an ArrowDB app and set environment vars for ARROWDB_APPKEY'.red);
	process.exit(1);
}

var ArrowDB = require('../lib/arrowdb');
var userID = '';
console.log("here ..... 1")

console.log('Creating ArrowDB app instance...'.cyan);
var arrowDBApp = new ArrowDB(process.env.ARROWDB_APPKEY, {
	autoSessionManagement: false
}); 

console.log('Created: '.cyan + '%j', arrowDBApp);

arrowDBApp.sessionCookieString = '372de6fe98278b9b807a5ace39e3dc8f';
arrowDBApp.dashboardSession = 's:uNn1OiGmFRM5HiaPA0s1_FWiVL8P-IHv.Fbm9ahWsgPJbYmkE8b264awtAoRl8EyhR+r/A6RSOrk';

//var arrowDBObjectList = arrowDBApp.getDBObjects();
//console.log(arrowDBObjectList);

console.log('User creating...'.cyan);
arrowDBApp.userCreate({
		'_login': 'paul2',
		'_password': 'cocoafish2',
		'_admin_': true,
}, function(err, resultCreate) {
	if (err) {
		console.error(err);
		return;
	}
	console.log('User create request finished: '.cyan + '%j', resultCreate.body);
	console.log('User logging in using SDK method...'.cyan);
	var obj = JSON.parse(JSON.stringify(resultCreate.body));
	userID = obj.response.data[0]._id;

	var username = 'paul2';
	var password = 'cocoafish2';
	var authNew = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

	arrowDBApp.userLogin({
		req: {
			headers: {
				Authorization: authNew,
			}
		}
	}, function(err, resultLogin) {
		if (err) {
			console.error(err);
			return;
		}
		console.log('User login request using SDK method finished: '.cyan + '%j', resultLogin.body);
		console.log('User logging in using REST API method: '.cyan);
		arrowDBApp.get('/v2/user/login', 
		{
			req: {
				headers: {
					Authorization: authNew,
				}
			}
		}
		,function(err, resultLoginREST) {
			if (err) {
				console.error(err);
				return;
			}	
			console.log('User login request using REST API method finished: '.cyan + '%j', resultLoginREST.body);
			console.log('Cookie string returned: %s', resultLoginREST.cookieString);
			console.log("user id is ", userID);
			arrowDBApp.dashboardSession = 's:uNn1OiGmFRM5HiaPA0s1_FWiVL8P-IHv.Fbm9ahWsgPJbYmkE8b264awtAoRl8EyhR+r/A6RSOrk';
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

