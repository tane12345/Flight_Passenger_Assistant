var express = require('express');
var router = express.Router();
var Flight = require('../model/flightinfo');

router.get('/', function (req, res) {

	if (!req.isAuthenticated()) {
		req.flash('error', 'Login to see your flights');
		res.redirect('/login');

	}
	else {
		var username = req.app.locals.user.username;
		Flight.find({ username: username }, function (err, data) {
			res.render('yourflight', { flights: data[0].flight });
		});

	}


});

module.exports = router;