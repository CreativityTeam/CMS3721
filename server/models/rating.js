var mongoose = require('mongoose');
var RatingSchema = mongoose.Schema({
    score :{
        type : Number
    }
});

var Rating = module.exports = mongoose.model('Rating',RatingSchema);

module.exports.addRating = function(rating,callback){
    rating.save(callback);
};

module.exports.getRatingById = function(id,callback){
    Rating.findById(id,callback);
};