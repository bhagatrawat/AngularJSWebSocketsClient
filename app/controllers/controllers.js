/**
#####################################
 Desc: Application Controller
 @Author: Bhagat Singh
 ####################################
*/
var applications = [];
consoleApp.controller('ApplicationsController', function ($scope, rsServiceFactory) {
    
    init();

    function init(){
      console.log('############## In ApplicationsController init ##############');
		  //Create a new WebSocket.
      var socket = new WebSocket('ws://localhost:9191/applications');

      // Handle any errors that occur.
      socket.onerror = function(errorEvent) {
         document.getElementById("wsServerStatus").innerHTML = '<span style="color: red;">Error</span>';
        console.log('Error: ' + errorEvent.data);
      };


      // Show a connected message when the WebSocket is opened.
      socket.onopen = function(event) {
        // Send the message through the WebSocket.
        socket.send("Connect Me");
        console.log('Websocket Connected');
      };


      // Handle messages sent by the server.
      socket.onmessage = function(event) {
      	var responseMsg = event.data;
      	console.log("Response: "+ responseMsg);
        if(!angular.isUndefined(responseMsg) && responseMsg != null && responseMsg !=''){
        	$scope.applications = JSON.parse(responseMsg);
           	$scope.$apply();
       	}else{
		$scope.applications = "";
		$scope.$apply();
       		console.log('No apps available to display on screen.');
       	}
            document.getElementById("wsServerStatus").innerHTML = '<span style="color: green;">Connected</span>';
      };

      // Show a disconnected message when the WebSocket is closed.
        socket.onclose = function(closeEvent) {
            document.getElementById("wsServerStatus").innerHTML = '<span style="color: red;">Disconnected</span>';
            console.log('####connection closed#### =>Code:'+ closeEvent.code + ' Reason : '+ closeEvent.reason  );
        };
    }

    $scope.stopMarked = function() {
		console.log('stopMarked cliked');
    };
    
    $scope.startMarked = function() {
		console.log('startMarked cliked');
    };
    
    $scope.bounceMarked = function() {
		console.log('bounceMarked cliked');
    };

    $scope.serviceCommand = function(application) {
		var actionType = application.status;
		var planType = "transition";
		var mountPoint= application.mountpoint;
		var fabric= application.fabricname;
		
		if(application.status == 'running'){
			console.log('User Clicked to stop application.');
			var planStatus = createPlans(fabric, "stopped", planType, mountPoint);
			application.status ='stopped';
		}else if(application.status == 'stopped'){
			console.log('User Clicked to start application.');
			var planStatus = createPlans(fabric, "running", planType, mountPoint);
			application.status ='running';
		}else{
			console.log('**** Unidentified acton ****');
		}
    };

    $scope.hideInfoRow = function(applications) {
		return isNotNull(applications);
    };
	
	//Create plan method
	function createPlans(fabric, state, planType, mountPoint){
		console.log("In createPlans: Fabric[ "+fabric +"] State["+state +"] Plan Type["+ planType+"] Mount Point[ "+ mountPoint+"]");
		rsServiceFactory.createPlans(fabric, state, planType, mountPoint)
			.success(function(data, status, headers, config) {
				var createdPlanUrl = headers('Location');
				if(isNotNull(createdPlanUrl)){
					console.log('Created Plan Url:'+createdPlanUrl);
					return executePlan(createdPlanUrl);
				}else{
					console.log('ELSE: Created Plan Url:'+createdPlanUrl);
					return status;
				}
		  }).
		  error(function(data, status, headers, config) {
				console.log('Error: Created Plan Status: '+ status);
		  });
	  }
	  
	  //Create plan method
	  function executePlan(createdPlanUrl){
		rsServiceFactory.executePlan(createdPlanUrl)
			.success(function(data, status, headers, config) {
				var executedPlanUrl = headers('Location');
				if(isNotNull(executedPlanUrl)){
					console.log('Executed Plan Url: '+ executedPlanUrl);
					return getExecutedPlanStatus(executedPlanUrl);
				}else{
					return status;
				}
		  }).
		  error(function(data, status, headers, config) {
				console.log('Executed Plan Error Status: '+ status);
				return status;
		  });
	  }
	  
	  //Execution status check method 
	 function getExecutedPlanStatus(executedPlanUrl){
		rsServiceFactory.getExecutedPlanStatus(executedPlanUrl)
			.success(function(data, status, headers, config) {
				if(!$scope.$$phase) {
					$scope.$apply();
				}
				console.log('Stop applicaton success Status: '+ status);
				return status;
		  }).
		  error(function(data, status, headers, config) {
				console.log('Stop applicaton Error Status: '+ status);
				return status;
		  });
	  }
	//method to check null/blank or empty
	function isNotNull(obj){
		//console.log('In isNotNull: '+ obj);
		if(angular.isUndefined(obj) || obj === null || obj.length < 1){
			return false; 
		}else{
			return true;
		}
	}
});

//Navigation Controller
consoleApp.controller('NavbarController', function ($scope, $location) {

    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true;
        } else {
            return false;
        }
    }
});


//Navigation Controller
consoleApp.controller('AboutController', function ($scope) {
//do nothing for now
});
