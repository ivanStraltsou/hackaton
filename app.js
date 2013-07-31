/*
 Module dependencies.
 */

var http = require('http'),
	express = require('express'),
	path = require('path'),
	app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3001);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express["static"](path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/', function(req, res) {
	res.render('index', {
		title : 'Hackaton'
	});
});

app.get('/preview', function(req, res) {
	res.redirect('/#!/preview');
});

app.get('/views/:tmplId', function(req, res) {
	var id = req.params['tmplId'];

	res.render('public/' + id, {
		title : id
	});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
