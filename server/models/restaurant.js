var mongoose = require('mongoose');
var RestaurantSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    res_name:{
        type : String
    },
    description:{
        type : String
    },
    location:{
        housenumber : String,
        street : String,
        district : String,
        city : String,
        point:{
            longitude : Number,
            latitude : Number
        }
    },
    type : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    menus:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    ratings:[{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: Number
    }],
    totalRating: {
        type: Number,
        default: 0
    },
    photo1:{
        type : String
    },
    photo2:{
        type : String
    },
    photo3:{
        type : String
    },
    photo4:{
        type : String
    },
    photo5:{
        type : String
    },
    publicities:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publicity'
    }],
    phone_number:{
        type: String
    }
});

var Restaurant = module.exports = mongoose.model('Restaurant',RestaurantSchema);

/**Update + Create Restaurant */
module.exports.createRestaurant = function(newRestaurant,callback){
    newRestaurant.save(callback);
};

module.exports.getRestaurantById = function(id,callback){
    Restaurant.findById(id).populate('user_id').populate({path: 'comments', populate: {path: 'user_id'}}).populate('publicities').populate('type').populate('menus').exec(callback);
};

module.exports.findRes = function(callback){
    Restaurant.find(callback);
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

module.exports.findPublicitiesBeLong = function(id,callback){
    Restaurant.findById(id).populate('publicities').exec(callback);
};

module.exports.deleteRestaurant = function(id,callback){
    var query = { _id : id};
    Restaurant.findOneAndRemove(query,callback);
};

module.exports.getAllPublicity = function(callback){
   Restaurant.find().populate('publicities').exec(callback); 
}

/**Find Restaurant by type */
module.exports.findResByType = function(type,callback){
    var query = { type : type };
    Restaurant.find(query).populate('type').exec(callback);
};

/**Find Menu restaurant */
module.exports.findResMenu = function(id,callback){
    Restaurant.findById(id).populate('menus').exec(callback);
};

