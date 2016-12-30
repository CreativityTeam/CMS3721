/**
 * Created by K on 10/2/2016.
 */

var mongoose = require('mongoose');
var PublicitySchema = mongoose.Schema({
    publicity_name: {
        type: String
    },

    publicity_desciption: {
        type: String
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

    publicity_price: {
        type: Number
    }
});

var Publicity = module.exports = mongoose.model('publicity', PublicitySchema);

/*Create Publicity*/
module.exports.createPublicity = function (newPublicity, callback) {
    newPublicity.save(callback);
};

module.exports.getPublicityById = function (id, callback) {
    Publicity.findById(id, callback);
};

module.exports.getPublicityByName = function (name, callback) {
    var query = {publicity_name: name};
    Publicity.find(query, callback);
};

module.exports.getAllPublicity = function (callback) {
    Publicity.find(callback);
};

/*Remove Publicity*/
module.exports.removePublicity = function (id, callback) {
    Publicity.findByIdAndRemove(id, callback);
};