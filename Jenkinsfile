#! groovy
library 'pipeline-library@allow_nolockfile'

withCredentials([string(credentialsId: 'arrowdb-test-apikey', variable: 'ARROWDB_APPKEY')]) {
	buildNPMPackage {
		// projectKey = 'MBAAS' TODO: see if this is
	}
}
