/*
var mongoose = require('mongoose');

var drawInsSchema = new mongoose.Schema({
	YEAR : Number, 
	NAME : String,
	CAT1 : String,
	CAT2 : String
});

citySchema.statics.saveSingle = function(obj, cb){
	console.log(obj);
	var file = new this(obj).save(cb);
	console.log("Entry added to Database");
}

citySchema.statics.getAll = function(res){
	City.find(
        {},
        function(err, docs) {
        if (!err){ 
           res.render('index', {
				title: 'Awesome App',
				all: docs
			});
        } else { 
        	throw err;
        }
    });
}

citySchema.statics.getCityNames = function(res, City){
	City.find().distinct('NAME', function(err, nameArr) {
    	if (!err){ 
			console.log(nameArr);
			res.render('index', {
				title: 'Awesome App',
				names: nameArr
			});
        } else { 
        	throw err;
        }
	});
}

citySchema.statics.getCityByName = function(req, res, City){
	//http://stackoverflow.com/questions/5373987/how-to-use-jquery-ajax-calls-with-node-js
	res.writeHead(200, {"Content-Type": "application/json"});
	var name = req.params.name;
	City.findOne(
        { NAME : name },
        function(err, doc) {
        if (!err){ 
			console.log("Inside City model returning");
			console.log(doc);
			res.end(JSON.stringify(doc));
        } else { 
        	res.end(JSON.stringify({}));
        }
    });
}

module.exports = mongoose.model('City', citySchema);
*/

var mongoose = require('mongoose');

var drawInsSchema = mongoose.Schema({
	users : [String]
});

/**
 * Method used to create new session
 */
drawInsSchema.statics.createSingleDrawIns = function(res){
	var entry = new this({ users : [] });
	entry.save();
	console.log("Created new Draw Instance " + entry.id);
	res.redirect(301, "/" + entry.id);
}

/**
 * Method used to save a single user
 * @param  {string} user_id [Id of the user]
 * @param  {string} sess_id [Id of the session]
 */
drawInsSchema.statics.saveSingleUser = function(user_id, sess_id){
	var good_sess_id = sess_id.substring(1);

	this.findOneAndUpdate({ _id : good_sess_id}, {$push : { users : user_id }}, function(err, model){
		if(err) console.log(err);
	});
}

/**
 * Method to remove a session given the id
 * @param  {string} id [Id of the session]
 */
drawInsSchema.statics.removeSingleDrawIns = function(id){
	console.log("Removing session " + id);
}

/**
 * Method to remove a single user
 * @param  {string} user_id [Id of the user]
 * @param  {string} sess_id [Id of the session]
 */
drawInsSchema.statics.removeSingleUser = function(user_id, sess_id){
	var good_sess_id = sess_id.substring(1);
	console.log("Removing from sid:" + sess_id + " uid:" + user_id);
	this.update({ '_id' : good_sess_id}, {$pull : {users : user_id}}, function(err, model){
		if(err) console.log(err);
	});
}

module.exports = mongoose.model('DrawIns', drawInsSchema, 'DrawIns');

