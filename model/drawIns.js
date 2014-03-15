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
 * Method to close DrawIns
 * @param  {String} sess_id [id of session]
 */
drawInsSchema.statics.removeSessionIfEmpty = function(sess_id){
	var good_sess_id = sess_id.substring(1);
	this.findOne({ _id : good_sess_id}, function(err, obj){
		if(!err){
			if(obj && obj.users.length == 0){
				obj.remove();
			}
		} else {
			console.log(err);
		}
	});
}

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
	var Model = this;
	var good_sess_id = sess_id.substring(1);
	Model.findOneAndUpdate({ _id : good_sess_id}, {$push : { users : user_id }}, function(err, model){
		if(err) console.log(err);
	});
}

/**
 * Method to remove a single user
 * @param  {string} user_id [Id of the user]
 * @param  {string} sess_id [Id of the session]
 */
drawInsSchema.statics.removeSingleUser = function(user_id, sess_id){
	var Model = this;
	var good_sess_id = sess_id.substring(1);
	Model.update({ '_id' : good_sess_id}, {$pull : {users : user_id}}, function(err, model){
		if(!err){
			Model.removeSessionIfEmpty(sess_id);
		} else {
			console.log(err);
		}
	});
}

module.exports = mongoose.model('DrawIns', drawInsSchema, 'DrawIns');

