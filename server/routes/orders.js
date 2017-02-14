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
    
    for(var food in req.body.foods){
        newOrder.foods.push({
            food_id : req.body.foods[food].id,
            quantity : req.body.foods[food].quantity
        })
    }

    Order.createOrder(newOrder,function(err,order){
        if(err) console.log(err);
        res.json({
            success : true,
            msg : "Successfully Create Order",
            data : order 
        });
    });    
});

/**Request 
 * */
/**Response
 * data: orders
 */
router.get('/findinfo/all',function(req,res){
    Order.getAllOrder(function(err,orders){
        if(err) console.log(err);
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
        if(err) console.log(err);
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
        if(err) console.log(err);
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
        if(err) console.log(err);
        res.json({
            success: true,
            msg: "Find done",
            data: order.foods
        });
    });
});


/**Request
 * body
 *  id: Order ID
 * body
 *  status */
/**Response
 * data: order
 */
router.put('/updatestatus',function(req,res){    
    Order.getOrderById(req.body.id,function(err,order){
        if(err) console.log(err);    
        // console.log('Enter update status API');             
        var io = req.io;          
        var msg = {
            'status': req.body.status,
            'order_id': req.body.id
        };                                   
        io.emit('status', msg);     
        order.shippingstatus = req.body.status;               
        Order.createOrder(order,function(err,order){
            if(err) console.log(err);
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
        if(err) console.log(err);
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
 - * body
 - *  id: Order ID
 - *  location_shipping*/
 /**Response
 - * data: order
 - */
 router.put('/updateshiplocation',function(req,res){
     Order.getOrderById(req.body.id,function(err,order){
        if(err) console.log(err);     
        // console.log('Enter update location API')                       
        var io = req.io;                                          
        io.emit('location', req.body);             
        order.locationshipping = {
            point : {
                longitude : req.body.longitude,
                latitude : req.body.latitude
            }  
        };
        Order.createOrder(order,function(err,order){
         if(err) console.log(err);
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
        if(err) console.log(err); 
        var feeShipping = req.body.feeShipping;
        order.feeshipping = feeShipping;
        order.total_price = order.total_price + feeShipping;               
        Order.createOrder(order,function(err,order){
            if(err) console.log(err);
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