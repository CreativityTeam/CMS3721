var mongoose = require('mongoose');
var ServiceSchema = mongoose.Schema({
    service_name: {
        type: String
    },
    service_desciption: {
        type: String
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
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
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    ratings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }],
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
    }
});

var Service = module.exports = mongoose.model('service', ServiceSchema);

/*Create Service*/
module.exports.createService = function (newService, callback) {
    newService.save(callback);
};

module.exports.getServiceById = function (id, callback) {
    Service.findById(id).populate('comments').populate('ratings').exec(callback)
};

module.exports.getServiceByName = function (name, callback) {
    var query = {service_name: name};
    Service.find(query, callback);
};

module.exports.findAll = function(callback){
    Service.find(callback);
}

module.exports.findCategory = function(id,callback){
    var query = {category: id};
    Service.find(query,callback); 
}

/*Remove Service*/
module.exports.removeService = function (id, callback) {
    Service.findByIdAndRemove(id, callback);
};