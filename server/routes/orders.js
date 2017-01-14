var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var User = require('../models/user');

/**Request 
 * body 
 *  user_order_id
 *  foods: Array of Food Item
 *  services: Array of Service Item
 *  time_ordered
 *  location_ordered
 *  comment     
 * */
/**Response 
 * data: order
*/

router.post('/create',function(req,res){
    var user_order = req.body.user_order_id;
    var res_belong = req.body.req_belong; 
    var time_ordered = req.body.time_ordered;
    var address = req.body.address;
    var point = {
        lon : req.body.lon,
        lat : req.body.lat
    };
    var comment = req.body.comment;
    var price = req.body.price;
    var newOrder = new Order({
        user_order: user_order,
        res_belong : res_belong,
        time_ordered: time_ordered,
        location_ordered: {
            address : address,
            point : {
                longitude : point.lon,
                latitude : point.lat
            }
        },
        comment: comment,
        total_price : price        
    });

    var orderPromise = new Promise(function(resolve,reject){
        for(var food in req.body.food){
            newOrder.foods.push({
                food_id : req.body.food[food].id,
                quantity : req.body.food[food].quantity
            })
        }
        resolve(newOrder)
    });

    orderPromise.then(function(order){
         Order.createOrder(order,function(err,order){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Successfully Create Order",
                data : order 
            });
        });
    })
});

/**Request 
 * */
/**Response
 * data: orders
 */
router.get('/findinfo/all',function(req,res){
    Order.getAllOrder(function(err,orders){
        if(err) throw err;
        res.json({
            success:true,
            data : orders
        });
    });
});

/**Request 
 * param 
 *  shipper_id: User ID 
 * */
/**Response
 * data: order
 */
router.get('/findinfobyshipper/:shipper_id',function(req,res){
    Order.getOrderByShipper(req.params.shipper_id,function(err,order){
        if(err) throw err;
        res.json({
            success:true,
            data : order
        });
    });
});

/**Request 
 * param 
 *  user_order: User ID 
 * */
/**Response
 * data: order
 */
router.get('/findinfobyuser/:user_id',function(req,res){
    Order.getOrderByUserOrder(req.params.user_id,function(err,order){
        if(err) throw err;
        res.json({
            success:true,
            data : order
        });
    });
});

/**Request
 * param
 *  id: Order ID
 * */
/**Response : 
 * data: foods Foods belong to Order */
router.get('/findfoods/:id',function(req,res){
    Order.findFoods(req.params.id,function(err,order){
        if(err) throw err;
        res.json({
            success: true,
            msg: "Find done",
            data: order.foods
        });
    });
});


/**Request
 * param
 *  id: Order ID
 * body
 *  status */
/**Response
 * data: order
 */
router.put('/updatestatus/:id',function(req,res){    
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err; 
        order.status = req.body.status;               
        Order.createOrder(order,function(err,order){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Successfully update",
                data : order
            });
        });
    });
});


/**Request
 * body
 *  id : Order ID */
/**Response
 * 
 */
router.delete('/deleteorder/:id',function(req,res){
    Order.removeOrder(req.params.id,function(err){
        if(err) throw err;
        res.json({
            success : true,
            msg : "Successfully Delete"
        });
    });
});

router.get('/findOrder/:id',function(req,res){
    Order.getAllInforOrderBelongID(req.params.id,function(err,order){
        res.json({
            success : true,
            data : order
        });    
    })
});

/**Get Res Name */
router.get('/getResName',function(req,res){
    Order.findResBelongName(function(err,listOrder){
        res.json({
            success : true,
            data : listOrder
        })
    });  
})

/**Request
 - * param
 - *  id: Order ID
 - * body
 - *  location_shipping*/
 /**Response
 - * data: order
 - */
 router.put('/updateshiplocation/:id',function(req,res){
     Order.getOrderById(req.params.id,function(err,order){
         if(err) throw err;
         order.locationshipping = {
                point : {
                    longitude : req.body.location_shipping.long,
                    latitude : req.body.location_shipping.lat
                }  
         };
         Order.createOrder(order,function(err,order){
             if(err) throw err;
             res.json({
                success : true,
                data: order
             });
         });
     });
 });

/**Router Update Fee and total_price */
router.post('/updatefee/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err; 
        var feeShipping = req.body.feeShipping;
        order.feeshipping = feeShipping;
        order.total_price = order.total_price + feeShipping;               
        Order.createOrder(order,function(err,order){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Successfully update",
                data : order
            });
        });
    });
});

router.get('/findAllOrder',function(req,res){
    Order.getAllOrderList(function(err,order){
        res.json({
            success : true,
            data : order
        });    
    })
});

module.exports = router;