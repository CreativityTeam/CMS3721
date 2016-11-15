var mongoose = require('mongoose');
var PhotoSchema = mongoose.Schema({
    url : {
        type : String
    },
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    description : {
        type: String,
    }
});

var Photo = module.exports = mongoose.model('Photo',PhotoSchema);

module.exports.addPhoto = function(photo,callback){
    photo.save(callback);
};

module.exports.findByUser = function(id,callback){
    var query = { userid : id };
    Photo.find(query,callback);
};

module.exports.remove = function(id,callback){
    var query = { _id : id };
    Photo.findOneAndRemove(query,callback);
};