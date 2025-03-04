/**
 * Loads all ArrowDB Object APIs and their REST descriptors from the 'arrowDBObjects'
 * directory.
 *
 * @module apis
 *
 * @copyright
 * Copyright (c) 2012-2014 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const
	arrowDBRest = require('./rest'),
	fs = require('fs'),
	path = require('path'),
	u = require('./util'),
	_ = require('lodash'),
	config = require('../config');

	DOC_BASE_URL = 'http://docs.appcelerator.com/cloud/latest/#!/api/',

	// Suported HTTP method for direct rest call. User can use arrowDBApp.post('/v1/users/login.json')
	HTTP_METHOD_LIST = ['get', 'post', 'put', 'delete'],

	apisDirV1 = path.join(__dirname, 'arrowDBObjects'),
	apisDirV2 = path.join(__dirname, 'arrowDBObjects_V2'),
	jsRegExp = /\.js$/;
	V1URL = 'v1',
	V2URL = 'v2';

var arrowDBObjects = {},
	DEFAULT_API_ENTRY_POINT = config.endpoint.api,
	publicAPI = {};

/*
 * Public APIs
 */
module.exports = publicAPI;

publicAPI.SwitchVersion = function SwitchVersion(version) {

	apisDir = "";
	url = "";
	switch(version) {
		case "v1":
			apisDir = apisDirV1;
			url = V1URL;
		  break;
		case "v2":
			apisDir = apisDirV2;
			url = V2URL;
		  break;		  
	  }

	// read javascript files one by one for V1 apis
	fs.readdirSync(apisDir).forEach(function (filename) {
		if (jsRegExp.test(filename)) {
			_.merge(arrowDBObjects, require(path.join(apisDir, filename)));
		}
	});


	// add doc url and method list into each ArrowDB objects, then define each public api
	Object.keys(arrowDBObjects).forEach(function (arrowDBObjectKey) {
		var arrowDBObject = arrowDBObjects[arrowDBObjectKey],
			objectName = arrowDBObject.objectName || arrowDBObjectKey,
			baseMethodName = u.lowercaseFirstChar(objectName);

		arrowDBObject.objectName || (arrowDBObject.objectName = baseMethodName);
		arrowDBObject.docUrl = DOC_BASE_URL + arrowDBObjectKey;
		arrowDBObject.fieldList = arrowDBObject.fields;
		arrowDBObject.methods || (arrowDBObject.methods = {});
		arrowDBObject.methodList = Object.keys(arrowDBObject.methods);

		// construct the methods for each ArrowDB object such as `usersLogin()` and `aclsQuery()`
		arrowDBObject.methodList.forEach(function (arrowDBObjectMethodKey) {
			var methodName = baseMethodName + u.capitalizeString(arrowDBObjectMethodKey),
				arrowDBObjectMethod = arrowDBObject.methods[arrowDBObjectMethodKey];

			arrowDBObject.methods[arrowDBObjectMethodKey].apiMethodName = methodName;
			publicAPI[methodName] = arrowDBRest.createArrowDBRequestFunction({
				arrowdbObjectURL: 			   url,
				arrowDBObjectKey:              arrowDBObjectKey,
				arrowDBObjectName:             (arrowDBObject.restObject || arrowDBObjectMethod.restObject || arrowDBObjectKey).toLowerCase(),
				arrowDBObjectMethodKey:        arrowDBObjectMethodKey,
				arrowDBObjectMethodName:       arrowDBObjectMethod.restMethod || arrowDBObjectMethodKey,
				arrowDBObjectMethodPreAction:  arrowDBObjectMethod.preAction,
				arrowDBObjectMethodPostAction: arrowDBObjectMethod.postAction,
				httpMethod:                arrowDBObjectMethod.httpMethod
			});
		});
	});

	// create methods for each supported HTTP method such as `arrowDBApp.get()` and `arrowDBApp.post()`
	HTTP_METHOD_LIST.forEach(function (httpMethod) {
		publicAPI[httpMethod] = arrowDBRest.createArrowDBRESTRequestFunction(httpMethod.toUpperCase());
	});

}

/**
 * Returns the full map of all ArrowDB Object descriptors for V1
 */
publicAPI.getDBObjects = function getDBObjects() {
	return arrowDBObjects;
};