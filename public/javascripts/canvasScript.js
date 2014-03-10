//http://stackoverflow.com/questions/5751458/getting-correct-mouse-position-in-a-css-scaled-canvas
//http://dev.opera.com/articles/view/html5-canvas-painting/
//http://wesbos.com/html5-canvas-websockets-nodejs/

var imageView;
var context;
var tool;
var fayeClient;
var clearBtn;
var subList;
var subId = "";

$(document).ready(function(){
	//Variables
	imageView = $("#imageView");
	clearBtn = $("#clear");
	subList = $("#subs");
	context = imageView[0].getContext('2d');
	tool = new pencil();
	fayeClient = new Faye.Client('http://localhost:3000/faye', {
		timeout : 120
	});

	//Events
	
	//Subscription event
	fayeClient.subscribe('/channel', function(message){
		var obj = JSON.parse(message);
		var func = tool[obj.type];
		//if there is a method
		if(func) func(obj);
	});

	//Click event for clearing
	clearBtn.click(function(){
		var obj = {
			type : "clear",
			x : 0,
			y : 0,
			clientId : subId
		};

		fayeClient.publish("/channel", JSON.stringify(obj), function(err){
          console.log( "Error ",err );
        });
	});

	//mouse events
	imageView.mousemove(cursorEvent);
	imageView.mousedown(cursorEvent);
	imageView.mouseup(cursorEvent);


	/**
	 * Does everything
	 */
	function cursorEvent(ev){
		var x = ev.pageX - imageView.offset().left;
		var y = ev.pageY - imageView.offset().top;
		var func = tool[ev.type];
		var obj = {
			type: ev.type,
			x : x,
			y : y,
			clientId : subId
		};
		fayeClient.publish("/channel", JSON.stringify(obj), function(err){
          console.log( "Error ",err );
        });
	}

	/**
	 * Pencil Object
	 */
	function pencil(element,ctx){
		var tool = element;
		var context = ctx;
		this.started = false;

		//Mouseup
		this.mouseup = function(obj){
			if (tool.started) {
		      tool.moveTo(obj.x, obj.y);
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
			if(subId == ""){
				subId = obj.clientId;
			}
		}
	}
});
