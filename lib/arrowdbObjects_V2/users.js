var arrowDBObject = {
	User: {
		methods: {
			"" :{ 
				//createMany
				httpMethod: 'POST'
			},
			count: { 
				httpMethod: 'GET'
			},
			create: {                 
				// createOne
				httpMethod: 'POST',
			},
			"": { 
				httpMethod: 'DELETE',
				restMethod: {
					entry: 'user_id',
					variables: ['user_id']
				}
			},
			"": { 
				httpMethod: 'DELETE',
			},
			login: { 
				httpMethod: 'GET',
				postAction: function (err, result) {
					if (!err && this.appOptions.autoSessionManagement) {
						this.sessionCookieString = result.cookieString;
					}
				}
			},
			logout: { 
				httpMethod: 'GET',
				postAction: function (/*err, result*/) {
					if (this.appOptions.autoSessionManagement) {
						this.sessionCookieString = null;
					}
				}
			},
			query: { 
				httpMethod: 'GET'
			},
			"": { 
				httpMethod: 'GET',
			},
			"": { 
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = arrowDBObject;
