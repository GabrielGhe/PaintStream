//http://stackoverflow.com/questions/5751458/getting-correct-mouse-position-in-a-css-scaled-canvas
//http://dev.opera.com/articles/view/html5-canvas-painting/

var imageView;
var context;
var tool;
var fayeClient;

$(document).ready(function(){
	//Variables
	imageView = $("#imageView");
	context = imageView[0].getContext('2d');
	tool = new pencil();
	fayeClient = new Faye.Client('http://localhost:3000/faye', {
		timeout : 120
	});

	//Events
	fayeClient.subscribe('/channel', function(message){
		var obj = JSON.parse(message);
		var func = tool[obj.type];
		//if there is a method
		if(func) func(obj.x, obj.y);
	});
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
			y : y
		};
		fayeClient.publish("/channel", JSON.stringify(obj), function(err){
          console.log( "Error ",err );
        });
	}
});


/**
 * Pencil Object
 */
function pencil(){
	var tool = this;
	this.started = false;

	//Mouseup
	this.mouseup = function(x, y){
		if (tool.started) {
	      tool.mousemove(x, y);
	      tool.started = false;
	    };
	};

	//Mousedown
	this.mousedown = function(x, y){
		context.beginPath();
		context.moveTo(x, y);
		tool.started = true;
	};

	//mousemove
	this.mousemove = function(x, y){
		if (tool.started) {
	      context.lineTo(x, y);
	      context.stroke();
	    }
	};
}