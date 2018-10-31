var mongoose = require('mongoose');


var postcab = mongoose.Schema({
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
	nos: {
		type: Number
	},
	car: {
		type: String
	}
});

module.exports = mongoose.model('Postcab', postcab);