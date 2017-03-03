var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserSchema = mongoose.Schema({
    local :{
        email :String,
        password : String,
        name : String
    },
    facebook :{
        id : String,
        name : String
    },   
    google :{
        id : String,
        email : String,
        name : String
    }, 
    role:{
        type:String,
        default : "User"
    },
    foods_favorite:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    }],
    res_favorite:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],
    avatar:{
        type: String,
    },
    gender:{
        type: String,
    },
    birthday:{
        type: Date,
    },
    last_login:{
        type : Date,
    },
    address:{
        type:String,
    },
    phone:{
        type:Number,
    },
    about:{
        type:String,
    },
    other:{
        type:String,
    },
    shipping:{
        type:String,
        default:'No'
    }
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.local.password,salt,function(err,hash){
            newUser.local.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.resetPassword = function(user,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(user.local.password,salt,function(err,hash){
            user.local.password = hash;
            user.save(callback);
        });
    });   
}

module.exports.createUserOther = function(newUser,callback){    
    newUser.save(callback);
};

module.exports.getUserByEmail = function(email,callback){
    var query = {'local.email' : email};
    User.findOne(query,callback);
};

module.exports.getUserByFacebookId = function(id,callback){
    var query = {'facebook.id' : id };
    User.findOne(query,callback);
};

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
};

module.exports.comparePassword = function(password,hash){
    return bcrypt.compareSync(password,hash);
};

module.exports.getAllUser = function(callback){
    User.find(callback);
};

module.exports.findUserByName = function(name,callback){
    var query = {'local.name' : name};
    User.find(query,callback);
};

module.exports.updateUser = function(user,callback){
    user.save(callback);
};

module.exports.findFoodFav = function(id,callback){
    User.findById(id).populate('foods_favorite').exec(callback);
};

module.exports.findResFav = function(id,callback){
    User.findById(id).populate('res_favorite').exec(callback);
};
