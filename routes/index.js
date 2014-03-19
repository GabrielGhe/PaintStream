var DrawIns = require('../model/drawIns');

/*
 * GET home page.
 */
exports.index = function(req, res){
	//create new DrawIns and redirect
	DrawIns.createSingleDrawIns(res);
};

/**
 * GET instance
 */
exports.instance = function(req, res){
	DrawIns.getUsers(req.params.id, res);
};

/**
 * For message passing in faye
 */
exports.message = function(req, res){
	bayeux.getClient().publish("/channel", {text: req.body.message});
	res.send(200);
};