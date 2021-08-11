var arrowDBObject = {
	File: {
		methods: {
	// batch delete handled though a REST call
	//		batchDelete: {
	//			httpMethod: 'DELETE'
	//			restMethod: 'batch_delete'
	//		},
			create: {
				httpMethod: 'POST',
			},
			delete: {
				httpMethod: 'DELETE'
			},
			query: {
				httpMethod: 'GET'
			},
			update: {
				httpMethod: 'PUT'
			},
	// show handled through a rest call
			// show: {
			// 	httpMethod: 'GET'
			// }
		}
	}
};

module.exports = arrowDBObject;
