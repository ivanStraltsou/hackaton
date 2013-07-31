module.exports = function(req, res) {
	console.log(req.params)
	if (req.params.templateName) {
		res.render('public/' + req.params.templateName);
	}
};
