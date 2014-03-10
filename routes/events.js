/**
 * Setting up the bayeux events
 */
exports.setup = function(bay){
	var bayeux = bay;

	bayeux.getClient().subscribe('/channel', function(message) {
	  console.log(message);
	});

	bayeux.on('subscribe', function(clientId, channel) {
	  console.log('[  SUBSCRIBE] ' + clientId + ' -> ' + channel);
	  var obj = {
			type: "subscribe",
			x : 0,
			y : 0,
			clientId : clientId
		};
		bayeux.getClient().publish('/channel', JSON.stringify(obj), function(err){
			console.log( "Error ",err );
		});
	});

	bayeux.on('unsubscribe', function(clientId, channel) {
		console.log('[UNSUBSCRIBE] ' + clientId + ' -> ' + channel);
		var obj = {
			type: "unsubscribe",
			x : 0,
			y : 0,
			clientId : clientId
		};
		bayeux.getClient().publish('/channel', JSON.stringify(obj), function(err){
			console.log( "Error ",err );
		});
	});

	bayeux.on('disconnect', function(clientId) {
	  console.log('[ DISCONNECT] ' + clientId);
	});
};
