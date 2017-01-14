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
    res_belong: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    foods: [{
        food_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'},
        quantity: Number
    }],
    time_ordered: {
        type: Date
    },
    locationshipping:{
        point:{
            longitude : Number,
            latitude : Number
        }
    },
    location_ordered{
        address : String,
        point:{
            longitude : Number,
            latitude : Number
        }
    },
    shippingstatus: {
        type: String,
        default: 'pending'        
    },
    paymentstatus: {
        type: String,
        default: 'Not Paid'        
    },
    feeshipping : {
        type: Number
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


/**Remove Order */
module.exports.removeOrder = function(id,callback){
    Order.findByIdAndRemove(id, callback);
};


/**find ResName */
module.exports.findResBelongName = function(callback){
    Order.find().populate('res_belong').exec(callback);
};

/**Get All Information */
module.exports.getAllInforOrder = function(id,callback){
    Order.findById(id).populate('foods.food_id').populate('user_order').populate('res_belong').populate('shipper').exec(callback);
};
