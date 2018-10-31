var mongoose = require('mongoose');

var getcab = new mongoose.Schema({
	username: {
		type: String
	},
	name: {
		type: String
	},
	phone: {
		type: String
	},
	date: {
		type: String
	},
	time: {
		type: String
	},
	from: {
		type: String
	},
	to: {
		type: String
	},
	nop: {
		type: Number
	}
});

module.exports = mongoose.model('Getcab', getcab);