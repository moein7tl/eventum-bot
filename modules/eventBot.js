var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var eventBotSchema = new Schema({
    date:   {type: Date, default: Date.now},
    url:    String, 
    email:  String
});
 
module.exports = mongoose.model('EventBot', eventBotSchema);