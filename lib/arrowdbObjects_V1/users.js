var arrowDBObject = {
	User: {
		methods: {
			"" :{
				//createMany
				httpMethod: 'POST'
			},
			batchDelete: {
				httpMethod: 'DELETE',
				restMethod: 'batch_delete'
			},
			count: {
				httpMethod: 'GET'
			},
			create: {
				// createOne
				httpMethod: 'POST',
			},
			delete: {
				httpMethod: 'DELETE',
				restMethod: {
					entry: 'user_id',
					variables: ['user_id']
				}
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: 'delete'
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
			requestResetPassword: {
				httpMethod: 'GET',
				restMethod: 'request_reset_password'
			},
			resendConfirmation: {
				httpMethod: 'GET',
				restMethod: 'resend_confirmation'
			},
			search: {
				httpMethod: 'GET'
			},
			show: {
				httpMethod: 'GET',
			},
			showMe: {
				httpMethod: 'GET',
				restMethod: 'show/me'
			},
			update: {
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = arrowDBObject;
