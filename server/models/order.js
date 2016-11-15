var mongoose = require('mongoose');
var OrderSchema = mongoose.Schema({
    user_order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    shipper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    foods: [{
        food_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'},
        quantity: Number
    }],
    services: [{
        service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'},
        quantity: Number
    }],
    time_ordered: {
        type: Date
    },
    location_ordered: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    location_shipping: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    status: {
        type: String,
        default: 'created'        
    },
    comment: {
        type: String
    },
    total_price: {
        type: Number
    }
});

var Order = module.exports = mongoose.model('Order',OrderSchema);

/**Create Order */
module.exports.createOrder = function(newOrder,callback){
    newOrder.save(callback);
};

module.exports.getAllOrder = function(callback){
    Order.find(callback);
};

module.exports.getOrderById = function(id,callback){
    Order.findById(id,callback);
};

module.exports.getOrderByShipper = function(shipper,callback){
    var query = {'shipper': shipper};
    Order.find(query,callback);
};

module.exports.getOrderByUserOrder = function(userOrder,callback){
    var query = {'user_order': userOrder};
    Order.find(query,callback);
};

/**Find Food belong */
module.exports.findFoods = function(id,callback){
    Order.findById(id).populate('foods.food_id').exec(callback);
};

/**Find Service belong */
module.exports.findServices = function(id,callback){
    Order.findById(id).populate('services.service_id').exec(callback);
};

/**Remove Order */
module.exports.removeOrder = function(id,callback){
    Order.findByIdAndRemove(id, callback);
};


