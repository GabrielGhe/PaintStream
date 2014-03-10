//http://stackoverflow.com/questions/5751458/getting-correct-mouse-position-in-a-css-scaled-canvas
//http://dev.opera.com/articles/view/html5-canvas-painting/
//http://wesbos.com/html5-canvas-websockets-nodejs/

var fayeClient = new Faye.Client('http://localhost:3000/faye', {
	timeout : 120
});

var MyApp = angular.module('MyApp', ['ngRoute', 'ngAnimate' , 'ui.bootstrap']);

//Routing Configuration 
MyApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', { templateUrl : "partials/home.html", controller : "HomeController"})
		.otherwise({ redirectTo : '/'});

	$locationProvider.html5Mode(true);
}]);


/* ###############################################################################
 * ##
 * ##							Home Controller
 * ##
 * ############################################################################### */

 MyApp.controller("HomeController", ["$scope", "$location", function($scope, $location){
 	//Variable declarations

 	/**
		Method used to go to different routes
	 */
	$scope.go = function ( hash ) {
		$location.path(hash);
	};
 }]);

/* ###############################################################################
 * ##
 * ##							Drawing Directive
 * ##
 * ############################################################################### */
 MyApp.directive("drawing", function(){
  return {
    restrict: "A",
    link: function($scope, element){
    	var ctx = element[0].getContext('2d');
		var tool = new pencil($scope, element, ctx);

		//Subscription event
		fayeClient.subscribe('/channel', function(message){
			var obj = JSON.parse(message);
			var func = tool[obj.type];
			//if there is a method
			if(func) func(obj);
		});

    	/**
		 * Does everything
		 */
		function cursorEvent(ev){
			//get x and y coordinates
			var x;
			var y;
			if(event.offsetX!==undefined){
	          x = event.offsetX;
	          y = event.offsetY;
	        } else { // Firefox compatibility
	          x = event.layerX - event.currentTarget.offsetLeft;
	          y = event.layerY - event.currentTarget.offsetTop;
	        }

			var func = tool[ev.type];
			var obj = {
				type: ev.type,
				x : x,
				y : y,
				clientId : $scope.subId
			};
			fayeClient.publish("/channel", JSON.stringify(obj), function(err){
	          console.log( "Error ",err );
	        });
		}

		//bind events
		element.bind('mousedown', cursorEvent);
		element.bind('mousemove', cursorEvent);
		element.bind('mouseup', cursorEvent);
    }
  };
});


/* ###############################################################################
 * ##
 * ##							Tool Object
 * ##
 * ############################################################################### */
function pencil(scope, element, ctx){
	var tool = element;
	var context = ctx;
	var $scope = scope;
	this.started = false;

	//Mouseup
	this.mouseup = function(obj){
		if (tool.started) {
	      tool.started = false;
	    };
	};

	//Mousedown
	this.mousedown = function(obj){
		context.beginPath();
		context.moveTo(obj.x, obj.y);
		tool.started = true;
	};

	//mousemove
	this.mousemove = function(obj){
		if (tool.started) {
	      context.lineTo(obj.x, obj.y);
	      context.stroke();
	    }
	};

	//clear
	this.clear = function(obj){
		context.clearRect(0, 0, imageView.width(), imageView.height());
	};

	//subscribe
	this.subscribe = function(obj){
		if($scope.subId == ""){
			$scope.subId = obj.clientId;
		}
	}
}