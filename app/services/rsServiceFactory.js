
/**
#######################################################################
	Desc: REST Service Factory to communicate with Orchestration Engine
	@Author: Bhagat Singh
#######################################################################	
*/
consoleApp.factory('rsServiceFactory', ['$http', function($http) {
	
	$http.defaults.headers.common.Authorization = 'Basic '+window.btoa('admin:admin');

    var rsServiceFactory = {};

	rsServiceFactory.createPlans = function (fabric, state, planType, mountPoint){
		var CREATE_PLANS_URI = '/console/rest/v1/<fabric>/plans';
		var encodedMountPoint = "mountPoint='"+mountPoint+"'";
		console.log('App Mount Point:'+ encodedMountPoint);
		var path = CREATE_PLANS_URI.replace("<fabric>", fabric);
		console.log('Path: '+path);
		return $http({
			url: path,
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			params: {"planType": planType, "state":state,"systemFilter":encodedMountPoint}
		 });
	};
	
	rsServiceFactory.executePlan = function (createdPlanUrl){
		var path =	createdPlanUrl+'/execution';
		return $http.post(path);
	};
	
	rsServiceFactory.getExecutedPlanStatus = function(executedPlanUrl){
		return $http.head(executedPlanUrl);
	};

	rsServiceFactory.getFabricInfo = function(fabric){
		var BASE_URI = '/console/rest/v1/<fabric>';
		var path = BASE_URI.replace("<fabric>", fabric);
		console.log('Path: '+path);
		return $http.get(path);
	};
	
    return rsServiceFactory;
}]);

