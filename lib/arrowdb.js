/**
 * Appcelerator Cloud Services (ArrowDB) application object.
 *
 * @module arrowdb
 *
 * @copyright
 * Copyright (c) 2012-2014 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const
	ArrowDBError = require('./arrowdbError'),
	
	messages = require('./messages'),
	async = require ('async'),
	got = require('got');
	request = require('sync-request'),
	apis = require('./apis'),
	config = require('../config');
	// Default appOptions

// allow these to be used as constants if we want to easily change the endpoints
var DEFAULT_API_ENTRY_POINT = config.endpoint.api,
DEFAULT_API_TEST_ENTRY_POINT = config.endpoint.test_api;

const DEFAULT_APP_OPTIONS = {
	apiEntryPoint: DEFAULT_API_ENTRY_POINT
};

ArrowDB.DEFAULT_API_ENTRY_POINT = DEFAULT_API_ENTRY_POINT;
ArrowDB.DEFAULT_API_TEST_ENTRY_POINT = DEFAULT_API_TEST_ENTRY_POINT;

/*
 * Public APIs
 */
module.exports = ArrowDB;

/**
 * Creates a object to expose an ArrowDB session. Each object maintains its own
 * state. For example, two different ArrowDB instances may be logged in as
 * different users.
 *
 * @class
 * @classdesc Main class to instantiate ArrowDB Node SDK object for user to use.
 * @constructor
 *
 * @example
 *   var ArrowDB = require('arrowdb');
 *   var arrowDBApp = new ArrowDB('ArrowDB_APP_KEY', {
 *           autoSessionManagement: true,
 *           apiEntryPoint: 'http://localhost:8080'
 *       });
 *
 *   arrowDBApp.usersLogin({
 *       login: ArrowDB_USERNAME,
 *       password: ArrowDB_PASSWORD
 *   }, function(err, result) {
 *       if (err) {
 *           console.error(err);
 *           return;
 *       }
 *       console.log('Logged in user: %j', result.body);
 *       arrowDBApp.usersShowMe(function(err, result) {
 *           if (err) {
 *               console.error(err);
 *               return;
 *           }
 *           console.log('Show user: %j', result.body);
 *       });
 *   });
 *
 * @param {string} arrowDBAppKey - The ArrowDB key to be used for API calls.
 * @param {object} [appOptions] - An object containing various options.
 * @param {string} [appOptions.apiEntryPoint] - The URL to use for all requests.
 * @param {string} [appOptions.dashboardSession] - The connect.sid to use for all requests.
 * @param {boolean [appOptions.autoSessionManagement=true] - When true, automatically manages
 *     the session cookie when logging in/out. When false, you must manually set the
 *     `arrowDBApp.sessionCookieString` to the `result.cookieString` after logging in as well
 *     as set the `arrowDBApp.sessionCookieString` to `null` after logging out.
 * @param {boolean} [appOptions.prettyJson] - When truthy, sets the `pretty_json` REST option.
 */
function ArrowDB(arrowDBAppKey, appOptions) {

	// make api ping call here
	// curl https://preprod-v2-api.cloud.appctest.com/v1/admins/ping.json
	/*
		{
			"meta":{
				"status":"ok",
				"code":200,
				"method_name":
				"adminPing"
			}
		}
	*/
	// curl "http://localhost:8080/v2/ping.json"
	/*
		{
			"status": 200,
			"message": "Server Up and Running",
			"method_name": "GET /v2/ping.json"
		}
	*/

	res = "";
	try {
		var res = request('GET', DEFAULT_API_ENTRY_POINT+'/v1/admins/ping.json');
	} catch (e) {
		console.log("Request error", e)
	}

	try {
		var pingResult = JSON.parse(res.getBody('utf8'));
		if ((pingResult.hasOwnProperty('meta')) && (pingResult.meta.hasOwnProperty('code')) && (pingResult.meta.code == 200)){
			console.log("BAAS version is v1")
			apis.SwitchVersion("v1");
		} else  {
			console.log("BAAS version is v2")
			apis.SwitchVersion("v2");
		}
	} catch (e) {
		console.log("Setting BAAS version to v2 as v1 cannot be reached")
		apis.SwitchVersion("v2");
	}
	
	if (!arrowDBAppKey) {
		throw new ArrowDBError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			parameter: 'ArrowDB app key'
		});
	}

	if (typeof arrowDBAppKey !== 'string') {
		throw new ArrowDBError(messages.ERR_WRONG_TYPE, {
			typeName: 'ArrowDB app key'
		});
	}

	this.appKey = arrowDBAppKey;

	if (!appOptions) {
		this.appOptions = DEFAULT_APP_OPTIONS;
	} else if (typeof appOptions !== 'object') {
		throw new ArrowDBError(messages.ERR_WRONG_TYPE, {
			typeName: 'ArrowDB app options'
		});
	} else {
		if(appOptions.apiEntryPoint && typeof appOptions.apiEntryPoint !== 'string') {
			throw new ArrowDBError(messages.ERR_WRONG_TYPE, {
				typeName: 'ArrowDB app options api entry point'
			});
		}

		if(appOptions.proxy && typeof appOptions.proxy !== 'string') {
			throw new ArrowDBError(messages.ERR_WRONG_TYPE, {
				typeName: 'ArrowDB app options proxy'
			});
		}

		this.appOptions = appOptions;
		this.appOptions.apiEntryPoint = this.appOptions.apiEntryPoint || DEFAULT_API_ENTRY_POINT;
	}

	// if autoSessionManagement isn't explicitly disabled, then force it on
	if (this.appOptions.autoSessionManagement !== false) {
		this.appOptions.autoSessionManagement = true;
	}
	this.sessionCookieString = null;


	

}

ArrowDB.prototype = Object.create(apis);
ArrowDB.getDBObjects = ArrowDB.prototype.getDBObjects;
