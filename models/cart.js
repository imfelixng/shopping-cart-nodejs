var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var cart = new Schema({
	fullname:  {type: String},
	phone: {type: String},
	email: {type : String},
	total: {type : Number},
},{collection : "cart"});

module.exports = mongoose.model('cart',cart);