var DrawIns = require('../model/drawIns');

/*
 * GET home page.
 */

exports.index = function(req, res){
	//create new DrawIns and redirect
	DrawIns.createSingleDrawIns(res);
};

exports.instance = function(req, res){
	res.render('drawIns', { title: 'PaintStream' });
};

exports.message = function(req, res){
	bayeux.getClient().publish("/channel", {text: req.body.message});
	res.send(200);
};