var express = require('express');
var router = express.Router();
var User = require('../model/schema');
var Getcab = require('../model/getcab');
var Postcab = require('../model/postcab');
var ObjectId = require('mongodb').ObjectID;
var unirest = require('unirest');

router.get('/', function (req, res) {
	if (!req.isAuthenticated()) {
		req.flash('error', 'Login To Add Flights');
		res.redirect('/login');
	}
	else {
		Getcab.find({ username: req.app.locals.user.username }, function (err, data) {
			var reqcabs = data;
			Postcab.find({ username: req.app.locals.user.username }, function (err, data) {
				var postcabs = data;
				res.render('cab', { user: req.app.locals.user, reqcabs: reqcabs, postcabs: postcabs });
			});
		});
	}

});

router.post('/request', function (req, res) {
	if (!req.isAuthenticated()) {
		req.flash('error', 'Login first to use cab services');
		res.redirect('/login');
	}
	else {
		var username = req.app.locals.user.username;
		var name = req.app.locals.user.name;
		var number = req.app.locals.user.number;
		var date = req.body.date;
		var time = req.body.time;
		var from = req.body.from;
		var to = req.body.to;
		var nop = req.body.nop;
		var newRequest = new Getcab({
			username: username,
			name: name,
			phone: number,
			date: date,
			time: time,
			from: from,
			to: to,
			nop: nop
		});
		newRequest.save(function (err, date) {
			console.log('New Cab Requested');
		});

		req.flash('success', 'New Cab Requested. Check the status under Requested Cabs Tab');
		res.redirect('/cab');
	}
});

router.post('/post', function (req, res) {
	if (!req.isAuthenticated()) {
		req.flash('error', 'Login first to use cab services');
		res.redirect('/login');
	}
	else {
		var username = req.app.locals.user.username;
		var name = req.app.locals.user.name;
		var number = req.app.locals.user.number;
		var date = req.body.date;
		var time = req.body.time;
		var from = req.body.from;
		var to = req.body.to;
		var nos = req.body.nos;
		var car = req.body.car;
		var newPost = new Postcab({
			username: username,
			name: name,
			phone: number,
			date: date,
			time: time,
			from: from,
			to: to,
			nos: nos,
			car: car
		});
		newPost.save(function (err, date) {
			console.log('New Cab Requested');
		});

		req.flash('success', 'New Cab Posted. Check the status under Posted Cabs Tab');
		res.redirect('/cab');
	}
});


router.get('/find/:scan?', function (req, res) {
	if (!req.isAuthenticated()) {
		req.flash('error', 'Login To Add Flights');
		res.redirect('/login');
	}
	else {
		var id = req.params.scan;
		Getcab.findOne({ '_id': new ObjectId(id) }, function (err, data) {
			var date = data.date;
			var time = data.time;
			var from = data.from;
			var to = data.to;
			var nop = data.nop;
			var arr = new Array();
			Postcab.find({ date: date, time: time, nos: { $gte: nop } }, function (err, docs) {
				count = 0;
				for (i = 0; i < docs.length; i++) {
					distanceCheck(i, docs.length, data, docs[i], function (j, length, call) {
						if (call == 'No Cabs Found') {
							console.log("");
						}
						else {
							arr.push(call);

						}
						count++;
						if (count == length) {
							res.render('cabfound', { cabs: arr, condition: "find" });
						}
					});

				}


			});
		});
	}


});


router.get('/get/:scan?', function (req, res) {
	if (!req.isAuthenticated()) {
		req.flash('error', 'Login To Add Flights');
		res.redirect('/login');
	}
	else {
		var id = req.params.scan;
		Postcab.findOne({ '_id': new ObjectId(id) }, function (err, data) {
			var date = data.date;
			var time = data.time;
			var from = data.from;
			var to = data.to;
			var nos = data.nos;
			var arr = new Array();
			Getcab.find({ date: date, time: time, nop: { $lte: nos } }, function (err, docs) {
				count = 0;
				for (i = 0; i < docs.length; i++) {
					distanceCheck(i, docs.length, data, docs[i], function (j, length, call) {
						if (call == 'No Cabs Found') {
							console.log("");
						}
						else {
							arr.push(call);

						}
						count++;
						if (count == length) {
							res.render('cabfound', { cabs: arr, condition: "get" });
						}
					});

				}


			});
		});
	}


});

function distanceCheck(i, length, data, docs, callback) {
	var originurl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + data.from.replace(/\s+/g, '') + '&destinations=' + docs.from.replace(/\s+/g, '') + '&key=AIzaSyAjH9W4DgyPfqobf9qyj7M2Hn9f1bQjUZg';
	var desurl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + data.to.replace(/\s+/g, '') + '&destinations=' + docs.to.replace(/\s+/g, '') + '&key=AIzaSyAjH9W4DgyPfqobf9qyj7M2Hn9f1bQjUZg';
	var Request = unirest.get(originurl)
		.end(function (res) {
			var origindis = res.body.rows[0].elements[0].distance.value;
			var Request = unirest.get(desurl)
				.end(function (res) {
					var desdis = res.body.rows[0].elements[0].distance.value;
					if (origindis < 2000 && desdis < 5000) {
						callback(i, length, docs);
					}
					else {
						callback(i, length, "No Cabs Found");
					}
				});
		});

}


module.exports = router;