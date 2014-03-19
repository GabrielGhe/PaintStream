var DrawIns = require('../model/drawIns');

/**
 * Setting up the bayeux events
 */
exports.setup = function(bay){
	var bayeux = bay;

	/*
	bayeux.getClient().subscribe('/channel', function(message) {
	  console.log(message);
	});
	*/

	/**
	 * The subscribe event
	 * Happens when a new user subscribes to a channel
	 */
	bayeux.on('subscribe', function(clientId, channel) {
	  console.log('[  SUBSCRIBE] ' + clientId + ' -> ' + channel);
	  var obj = {
			type: "subscribe",
			x : 0,
			y : 0,
			clientId : clientId
		};
		DrawIns.saveSingleUser(clientId, channel);
		bayeux.getClient().publish(channel, JSON.stringify(obj), function(err){
			console.log( "Error ",err );
		});
	});

	/**
	 * The unsubsribe event
	 * Happens when a user unsubsribes, closes tab or loses connection
	 */
	bayeux.on('unsubscribe', function(clientId, channel) {
		console.log('[UNSUBSCRIBE] ' + clientId + ' -> ' + channel);
		var obj = {
			type: "unsubscribe",
			x : 0,
			y : 0,
			clientId : clientId
		};
		DrawIns.removeSingleUser(clientId, channel);
		bayeux.getClient().publish(channel, JSON.stringify(obj), function(err){
			console.log( "Error ",err );
		});
	});

	/**
	 * The disconnect event
	 * Happens right after the subsribe event
	 */
	bayeux.on('disconnect', function(clientId) {
		console.log('[ DISCONNECT] ' + clientId);
	});
};

//SETUP FAYE EXTENSION
//http://faye.jcoglan.com/node/extensions.html
