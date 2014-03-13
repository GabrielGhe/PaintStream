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

module.exports = mongoose.model('City', citySchema, "City");
*/

