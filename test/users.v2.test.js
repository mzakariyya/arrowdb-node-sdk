var assert = require('assert'),
	testUtil = require('./testUtil');
const { format } = require('path');

var arrowDBEntryPoint = (process.env.ARROWDB_ENTRYPOINT ? process.env.ARROWDB_ENTRYPOINT : 'http://localhost:8080');
var arrowDBKey = process.env.ARROWDB_APPKEY;
if (!arrowDBKey) {
	console.error('Please create an ArrowDB app and assign ARROWDB_APPKEY in environment vars.');
	process.exit(1);
}
console.log('ArrowDB Entry Point: %s', arrowDBEntryPoint);
console.log('MD5 of ARROWDB_APPKEY: %s', testUtil.md5(arrowDBKey));

var ArrowDB = require('../index'),
	arrowDBApp = new ArrowDB(arrowDBKey, {
		apiEntryPoint: arrowDBEntryPoint,
		prettyJson: true
	}),
	arrowDBAppManualSession = new ArrowDB(arrowDBKey, {
		apiEntryPoint: arrowDBEntryPoint,
		prettyJson: true,
		autoSessionManagement: false
	}),
	arrowDBUsername = "paul2",
	arrowDBUsernameManualSession = null,
	manualSessionCookieString = null,
	arrowDBPassword = 'cocoafish2';
	sessionCookieString = '';
	userID = '';
	authNew = 'Basic ' + Buffer.from(arrowDBUsername + ':' + arrowDBPassword).toString('base64');
	

describe('Users Test', function() {

	describe('.loginUser', function() {
		it('Newly created user should be able to login successfully', function(done) {
			this.timeout(20000);
			arrowDBApp.userLogin({
				req: {
					headers: {
						Authorization: authNew,
					}
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert.equal(result.body.status, 200);
				assert.equal(result.body.method_name, 'GET /v2/user/login');
				sessionCookieString = result.cookieString;   
				done();
			});
		});
	});


	describe('.queryUsers', function() {
		it('Should return all users', function(done) {
			this.timeout(20000);
			arrowDBApp.userQuery({
                cookieString : sessionCookieString,
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert.equal(result.body.status, 200);
				assert.equal(result.body.method_name, 'GET /v2/user/query');
				done();
			});
		});
	});

	describe('.createUser', function() {
		it('Should create user correctly', function(done) {
			this.timeout(20000);
			arrowDBApp.userCreate({
				'_login': 'paul76',
				'_password': 'cocoafish64',
				cookieString : sessionCookieString,
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert.equal(result.body.status, 201);
				assert.equal(result.body.method_name, 'POST /v2/user');
				var obj = JSON.parse(JSON.stringify(result.body));
				userID = obj.response.data[0]._id;
				done();
			});
		});
	});


	describe('.updateUser', function() {
		it('Should update user successfully with custom_fields as a hash', function(done) {
			this.timeout(20000);

			arrowDBApp.userUpdate({
				data: {
					'$set':{'color':'blue'}
				},
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert.equal(result.body.status, 200);
				assert.equal(result.body.method_name, 'PUT /v2/user');
				done();
			});
		});
	});

	describe('.deleteUser', function() {
		it('Should delete user successfully', function(done) {
			this.timeout(20000);
			arrowDBApp.userDelete({
				'user_id': userID,
                cookieString : sessionCookieString,
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert.equal(result.body.status, 200);
				assert.equal(result.body.method_name, 'DELETE /v2/user/'+userID);
				done();
			});
		});
	});
});