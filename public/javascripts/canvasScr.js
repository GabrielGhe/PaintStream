//Canvas
//http://stackoverflow.com/questions/5751458/getting-correct-mouse-position-in-a-css-scaled-canvas
//http://dev.opera.com/articles/view/html5-canvas-painting/
//http://wesbos.com/html5-canvas-websockets-nodejs/
//http://plnkr.co/edit/aG4paH?p=preview
//https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial

//Angular
//http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html
//http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html

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

 	/**
 	 * Init
 	 */
 	$scope.Init = function(){
 		var arr = [];
 		$scope.members = arr;
 		$scope.subId = "";
 	}
 	
 	/**
 	 * Clear Canvas
 	 */
 	$scope.clear = function(){
 		var obj = {
			type: "clear",
			clientId : $scope.subId,
			pre : {
				x : 0,
				y : 0
			},
			op : {
				lX : 0,
				lY : 0,
				cX : 0,
				cY : 0
			}
		};

		fayeClient.publish("/channel", JSON.stringify(obj), function(err){
          console.log( "Error ",err );
        });
 	}

 	/**
 	 * adds a participant to the list
 	 */
 	$scope.addMember = function(obj){
 		$scope.$apply(function(){
 			$scope.members.push(obj);
 		});
 	}

 	/**
 	 * Removes a participant from the list
 	 */
 	$scope.removeMember = function(id){
 		$scope.$apply(function(){
 			var arr = $scope.members;
 			for(var i = arr.length - 1; i != 0; i--){
 				if(arr[i].id == id){
 					arr.splice(i, 1);
 					break;
 				}
 			}
 			$scope.members = arr;
 		});
 	}

 	/**
		Method used to go to different routes
	 */
	$scope.go = function ( hash ) {
		$location.path(hash);
	};

	$scope.Init();
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
				clientId : $scope.subId,
				pre : {
					x : x,
					y : y
				},
				op : {
					lX : 0,
					lY : 0,
					cX : 0,
					cY : 0
				}

			};
			if(func) func(obj);
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
	//Variables
	var tool = this;
	var element = element;
	var context = ctx;
	var $scope = scope;
	var lastX;
	var lastY;

	this.started = false;

	//Mouseup
	this.mouseup = function(obj){
		if (tool.started) {
	      tool.started = false;
	    };
	};

	//Mousedown
	this.mousedown = function(obj){
		lastX = obj.pre.x;
		lastY = obj.pre.y;
		context.beginPath();
		tool.started = true;
	};

	//mousemove
	this.mousemove = function(obj){
		if (tool.started) {
			obj.op.lX = lastX;
			obj.op.lY = lastY;
	      	obj.op.cX = obj.pre.x;
	      	obj.op.cY = obj.pre.y;
	      	obj.pre.x = 0;
	      	obj.pre.y = 0;
	      	obj.type = "draw";

	      	fayeClient.publish("/channel", JSON.stringify(obj), function(err){
	          console.log( "Error ",err );
	        });

			lastX = obj.op.cX;
			lastY = obj.op.cY;
	    }
	};

	//clear
	this.clear = function(obj){
		element[0].width = element[0].width; 
	};

	//draw
	this.draw = function(obj){
        ctx.moveTo(obj.op.lX,obj.op.lY);//from
        ctx.lineTo(obj.op.cX,obj.op.cY);//to
        ctx.strokeStyle = "#4bf";//color
        ctx.stroke();//draw it
	};

	//subscribe
	this.subscribe = function(obj){
		if($scope.subId == ""){
			$scope.subId = obj.clientId;
			$scope.addMember({ type: 'myIdClass', id: obj.clientId });
		} else {
			$scope.addMember({ type: 'otherIdClass', id: obj.clientId });
		}
	};

	//unsubscribe
	this.unsubscribe = function(obj){
		$scope.removeMember(obj.clientId);
	};
}