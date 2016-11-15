var mongoose = require('mongoose');
var RestaurantSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    res_name:{
        type : String
    },
    desciption:{
        type : String
    },
    location:{
        longitude : Number,
        latitude : Number
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    ratings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rating'
    }],
    photos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'photo'
    }],
    services:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service'
    }],
    publicities:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publicity'
    }]
});

var Restaurant = module.exports = mongoose.model('Restaurant',RestaurantSchema);

/**Update + Create Restaurant */
module.exports.createRestaurant = function(newRestaurant,callback){
    newRestaurant.save(callback);
};

module.exports.getRestaurantById = function(id,callback){
    Restaurant.findById(id,callback);
};

module.exports.findRes = function(name,callback){
    var query = { res_name : name };
    Restaurant.find(query,callback);
};

module.exports.findAdmin = function(id,callback){
    var query = { user_id : id };
    Restaurant.find(query,callback);
};

module.exports.findUserBelong = function(id,callback){
    Restaurant.findById(id).populate('user_id').exec(callback);
};

module.exports.findCommentOfRestaurant = function(id,callback){
    Restaurant.findById(id).populate('comments').exec(callback);
};

module.exports.findRating = function(id,callback){
    Restaurant.findById(id).populate('ratings').exec(callback);
};

module.exports.findPhotoBeLong = function(id,callback){
    Restaurant.findById(id).populate('photos').exec(callback);
};

module.exports.findServiceBeLong = function(id,callback){
    Restaurant.findById(id).populate('services').exec(callback);
};

module.exports.findPublicitiesBeLong = function(id,callback){
    Restaurant.findById(id).populate('publicities').exec(callback);
};

module.exports.findResLocation = function(longitude,latitude,callback){
    var query = {
        'location.longitude' : longitude,
        'location.latitude' : latitude
    };
    Restaurant.find(query,callback);
};

module.exports.findOneRes = function(longitude,latitude,callback){
    var query = {
        'location.longitude' : longitude,
        'location.latitude' : latitude
    };
    Restaurant.findOne(query,callback);
};

module.exports.deleteRestaurant = function(id,callback){
    var query = { _id : id};
    Restaurant.findOneAndRemove(query,callback);
};

