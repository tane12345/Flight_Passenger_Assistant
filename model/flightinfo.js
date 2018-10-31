var mongoose = require('mongoose');

var flightinfo = mongoose.Schema({
	username: { type: String },
	flight: { type: Array }
});

module.exports = mongoose.model('Flight', flightinfo);