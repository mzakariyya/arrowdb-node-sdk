var arrowDBObject = {
	User: {
		methods: {
			createMany :{
				//createMany
				httpMethod: 'POST'
			},
			count: { 
				httpMethod: 'GET'
			},
			create: {                 
				// createOne
				httpMethod: 'POST'
			},
			delete: {
				httpMethod: 'DELETE',
				restMethod: {
					entry: 'user_id',
					variables: ['user_id']
				}
			},
			deleteMany: {                   
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
			get: {                   
				httpMethod: 'GET'
			},
			update: {                   
				httpMethod: 'PUT'
			},
			updateMany: {                   
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = arrowDBObject;
