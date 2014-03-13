
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var drawIns = require('./model/drawIns');
var http = require('http');
var path = require('path');


//Mongoose connecting
var mongoose = require('mongoose');
mongoose.connect("localhost");
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

//Get Faye module and create nodeAdapter
var faye = require('faye');
var bayeux = new faye.NodeAdapter({
	mount: "/faye",
	timeout: 45
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/message', routes.message);
app.get('/users', user.list);

//Attach to faye 
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

bayeux.attach(server);
var bayeuxEvents = require('./routes/events');
bayeuxEvents.setup(bayeux);
