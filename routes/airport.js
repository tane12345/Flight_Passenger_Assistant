var express = require('express');
var router = express.Router();
var unirest = require('unirest');

router.get('/weather/:scan?', function (req, res) {

	if (!req.isAuthenticated()) {
		req.flash('error', 'Login To Add Flights');
		res.redirect('/login');
	}
	else {
		var scan = req.params.scan;
		var url = "https://api.flightstats.com/flex/weather/rest/v1/json/metar/" + scan + "?appId=9c8c18b1&appKey=fa9f824aa4b0be2767aac1159b5591a1";

		var Request = unirest.get(url)
			.timeout(30000)
			.end(function (resp) {
				var obj = JSON.parse(resp.raw_body);
				if (obj['error']) {
					req.flash('error', error.errorMessage);
					res.redirect('/airport/weather');
				}
				else {
					res.render('weather', { weather: obj });
				}
			});
	}

});


router.get('/nearby/:scan?', function (req, response) {
	var scan = req.params.scan;
	var res = scan.split(',');
	var latitude = res[0];
	var longitude = res[1];
	nearBy(latitude, longitude, response, function (rest, hos, pol, sho, tax, tra, res) {
		res.render('nearby', { rest: rest, hos: hos, pol: pol, sho: sho, tax: tax, tra: tra });
	});

});

function nearBy(latitude, longitude, res, callback) {
	var restaurant = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=4000&type=restaurant&key=AIzaSyAY5QYYU5d5hrU1FnUzjh17YF-zF72hpUM";
	var hotel = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=4000&type=lodging&key=AIzaSyAY5QYYU5d5hrU1FnUzjh17YF-zF72hpUM";
	var police = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=4000&type=police&key=AIzaSyAY5QYYU5d5hrU1FnUzjh17YF-zF72hpUM";
	var shopping_mall = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=4000&type=shopping_mall&key=AIzaSyAY5QYYU5d5hrU1FnUzjh17YF-zF72hpUM";
	var taxi_stand = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=4000&type=taxi_stand&key=AIzaSyAY5QYYU5d5hrU1FnUzjh17YF-zF72hpUM";
	var train_station = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=4000&type=train_station&key=AIzaSyAY5QYYU5d5hrU1FnUzjh17YF-zF72hpUM";
	var Request = unirest.get(restaurant)
		.end(function (resp1) {
			var rest = resp1.body;
			var Request = unirest.get(hotel)
				.end(function (resp2) {
					var hos = resp2.body;
					var Request = unirest.get(police)
						.end(function (resp3) {
							var pol = resp3.body;
							var Request = unirest.get(shopping_mall)
								.end(function (resp4) {
									var sho = resp4.body;
									var Request = unirest.get(taxi_stand)
										.end(function (resp5) {
											var tax = resp5.body;
											var Request = unirest.get(train_station)
												.end(function (resp6) {
													var tra = resp6.body;
													callback(rest, hos, pol, sho, tax, tra, res);
												});
										});
								});
						});
				});
		});
}

module.exports = router;
