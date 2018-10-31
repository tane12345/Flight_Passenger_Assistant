var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var user = mongoose.Schema({
	name: { type: String },
	number: { type: String },
	email: { type: String },
	username: { type: String, unique: true,},
	password: { type: String, bcrypt: true },
	otp: { type: String }
});

module.exports = mongoose.model('User', user);