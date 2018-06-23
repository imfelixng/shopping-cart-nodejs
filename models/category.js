var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var category = new Schema({
	id : {type : Number , default : 1},
	name:  {type: String, required : true},
},{collection : "category"});

module.exports = mongoose.model('category',category);