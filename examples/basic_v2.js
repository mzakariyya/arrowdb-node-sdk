var colors = require('colors');
if (!process.env.ARROWDB_APPKEY) {
	console.error('Please create an ArrowDB app and set environment vars for ARROWDB_APPKEY'.red);
	process.exit(1);
}

var ArrowDB = require('../lib/arrowdb');
var userID = '';

console.log('Creating ArrowDB app instance...'.cyan);
var arrowDBApp = new ArrowDB(process.env.ARROWDB_APPKEY, {
	autoSessionManagement: true
}); 

console.log('Created: '.cyan + '%j', arrowDBApp);

//console.log('User creating...'.cyan);
// arrowDBApp.userCreate({
// 		'_login': 'paul2',
// 		'_password': 'cocoafish2',
// 		'_admin_': true,
// }, function(err, resultCreate) {
// 	if (err) {
// 		console.error(err);
// 		return;
// 	}
// 	console.log('User create request finished: '.cyan + '%j', resultCreate.body);
// 	console.log('User logging in using SDK method...'.cyan);
// 	var obj = JSON.parse(JSON.stringify(resultCreate.body));
// 	userID = obj.response.data[0]._id;

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
		console.log('Cookie string returned: %s', resultLogin.cookieString);

        sessionCookieString = resultLogin.cookieString;   
        let r = (Math.random() + 1).toString(36).substring(7);     
        arrowDBApp.userCreate({
            '_login': r,
            '_password': 'cocoafish6',
        }, function(err, resultCreate) {
            if (err) {
                console.error(err);
                return;
            }
            console.log('User create normal request finished: '.cyan + '%j', resultCreate.body);
            var obj = JSON.parse(JSON.stringify(resultCreate.body));
            userID = obj.response.data[0]._id;

            arrowDBApp.userQuery({
                where: {"_id":userID},
            }, function(err, resultQuery) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('User query normal request finished: '.cyan + '%j', resultQuery.body);

                console.log('User update request using REST method: '.cyan);
                arrowDBApp.put('/v2/user/'+userID, 
                {
                    data: `{"$set":{"color":"blue"}}`,
                },function(err, resultUpdateREST) {
                    if (err) {
                        console.error(err);
                        console.log("user id is ", userID);
                        arrowDBApp.userDelete({
                            'user_id': userID,
                        }, function(err, resultDelete) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log('User delete request finished: '.cyan + '%j', resultDelete.body);
                        });	
                        return;
                    }
                    console.log('User update request finished: '.cyan + '%j', resultUpdateREST.body);
                });	
            });		
        });
	});

// });

