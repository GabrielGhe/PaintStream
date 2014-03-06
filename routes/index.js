
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'PaintStream' });
};

exports.message = function(req, res){
	bayeux.getClient().publish("/channel", {text: req.body.message});
	res.send(200);
};