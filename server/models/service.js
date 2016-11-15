/**
 * Created by K on 11/1/2016.
 */

var mongoose = require('mongoose');
var ServiceSchema = mongoose.Schema({
    service_name: {
        type: String
    },
    service_desciption: {
        type: String
    },
    service_price: {
        type: Number
    }
});

var Service = module.exports = mongoose.model('service', ServiceSchema);

/*Create Service*/
module.exports.createService = function (newService, callback) {
    newService.save(callback);
};

module.exports.getServiceById = function (id, callback) {
    Service.findById(id, callback);
};

module.exports.getServiceByName = function (name, callback) {
    var query = {service_name: name};
    Service.find(query, callback);
};

module.exports.getServiceByPrice = function (price, callback) {
    var query = {service_price: price};
    Service.find(query, callback);
};

module.exports.findAll = function(callback){
    Service.find(callback);
}

/*Remove Service*/
module.exports.removeService = function (id, callback) {
    Service.findByIdAndRemove(id, callback);
};