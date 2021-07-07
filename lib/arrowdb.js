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
	apis = require('./apis'),
	config = require('../config');
	// Default appOptions
	

var DEFAULT_API_ENTRY_POINT = '',
	DEFAULT_API_TEST_ENTRY_POINT = '';

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


	if (this.appOptions.baasVersion != null) {
		switch(this.appOptions.baasVersion) {
			case 'v1':
				console.log("here V1")
				apis.SwitchV1();
			break;
			case 'v2':
				console.log("here V2")
				apis.SwitchV2();
			break;
			default:
				throw new ArrowDBError(messages.ERR_WRONG_TYPE, {
					typeName: 'ArrowDB app options unreconised baas version'
				});
		  }
	} 
}

ArrowDB.prototype = Object.create(apis);
ArrowDB.getDBObjects = ArrowDB.prototype.getDBObjects;
