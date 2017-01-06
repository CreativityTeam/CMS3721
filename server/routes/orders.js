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
    var location_ordered = req.body.location_ordered;
    var comment = req.body.comment;
    var price = req.body.price;
    var newOrder = new Order({
        user_order: user_order,
        res_belong : res_belong,
        time_ordered: time_ordered,
        location_ordered: location_ordered,
        comment: comment,
        total_price : price        
    });
    
    Order.createOrder(newOrder,function(err,order){
        if(err) throw err;
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
 *  id: Order ID /
/**Response : 
 * data: services Services belong to Order */
router.get('/findservices/:id',function(req,res){
    Order.findServices(req.params.id,function(err,order){
        if(err) throw err;
        res.json({
            success: true,
            msg: "Find done",
            data: order.services
        });
    });
});

/**Request
 * param
 *  id: Order ID
 * body
 *  shipper_id
 *  time_ordered
 *  location_ordered
 *  comment */
/**Response
 * data: order
 */
router.put('/updateinfo/:id',function(req,res){    
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err; 
        order.shipper = req.body.shipper_id;       
        order.time_ordered = req.body.content;
        order.location_ordered = req.body.location_ordered;
        order.comment = req.body.comment;
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
 * param
 *  id: Order ID
 * body
 *  food_id
 *  quantity*/
/**Response
 * data: order.foods
 */
router.put('/addfood/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err;
        var food_id = req.body.food_id;
        var quantity = req.body.quantity;
        order.foods.push({food_id: food_id, quantity: quantity});
        Order.createOrder(order,function(err,order){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Successfully update",
                data: order.foods
            });
        });
    });
});

/**Request
 * param
 *  id: Order ID
 * body
 *  location_shipping*/
/**Response
 * data: order
 */
router.put('/updateshiplocation/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err;
        var location_shipping = req.body.location_shipping;
        order.location_shipping = location_shipping;
        Order.createOrder(order,function(err,order){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Successfully update",
                data: order
            });
        });
    });
});

/**Request
 * param
 *  id: Order ID
 * body
 *  serviced_id
 *  quantity*/
/**Response
 * data: order.services
 */
router.put('/addservice/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err;
        var service_id = req.body.service_id;
        var quantity = req.body.quantity;
        order.services.push({service_id: service_id, quantity: quantity});
        Order.createOrder(order,function(err,order){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Successfully update",
                data: order.services
            });
        });
    });
});

/**Request 
 * param 
 *  id: Order ID 
 * body 
 *  food_id: Food ID */
/**Response 
 *  data: foods Array of Foods belong to Order */
router.delete('/deletefood/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err;
        for(var i = 0;i < order.foods.length ; i++){
            if(order.foods[i].food_id == req.body.food_id){
                order.foods.splice(i,1);
                break;
            }
        }
        Order.createOrder(order,function(err,order){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Delete",
                    data : order.foods
            });
        });
    });
});

/**Request 
 * param 
 *  id: Order ID 
 * body 
 *  service_id: Service ID */
/**Response
 * data: foods Array of Foods belong to Order*/
router.delete('/deleteservice/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err;
        for(var i = 0;i < order.services.length ; i++){
            if(order.services[i].service_id == req.body.service_id){
                order.services.splice(i,1);
                break;
            }
        }
        Order.createOrder(order,function(err,order){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Delete",
                    data : order.services
            });
        });
    });
});




/**Request 
 * param 
 *  id: Order ID 
 * body 
 *  food_id: Food ID
 *  quantity: Food new quantity */
/**Response Array Food */
router.put('/updatefoodquant/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err;
        for(var i = 0;i < order.foods.length ; i++){
            if(order.foods[i].food_id == req.body.food_id){
                order.foods[i].quantity = req.body.quantity;
                break;
            }
        }
        Order.createOrder(order,function(err,order){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Update",
                    data : order.foods
            });
        });
    });
});

/**Request 
 * param 
 *  id: Order ID 
 * body 
 *  _id: Service ID, quantity: Service new quantity */
/**Response Array Service */
router.put('/updateservicequant/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err;
        for(var i = 0;i < order.services.length ; i++){
            if(order.services[i].service_id == req.body._id){
                order.services[i].quantity = req.body.quantity;
                break;
            }
        }
        Order.createOrder(order,function(err,order){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Update",
                    data : order.services
            });
        });
    });
});

/**Request 
 * param 
 *  id: Order ID 
 * body 
 *  _Update Price */
/**Response Array Service */
router.put('/updateprice/:id',function(req,res){
    Order.getOrderById(req.params.id,function(err,order){
        if(err) throw err;
        order.total_price = req.body.price;
        Order.createOrder(order,function(err,order){
                if(err) throw err;
                res.json({
                    success : true,
                    msg : "Successfully Update",
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

var getOrderName = function(id,callback){
      Order.findAllFoodService(id,function(err,orders){
        if(err) throw err;
        var listQuery = [];
        for(var item in orders){
            listQuery.push(
            new Promise(function(resolve,reject){
                    User.getUserById(orders[item].user_order,function(err,user){
                        OrderQuery = {
                            user : user.local.name,
                            res_belong : orders[item].res_belong,
                            status : orders[item].status,
                            user_order : orders[item].user_order,
                            time_ordered : orders[item].time_ordered,
                            total_price : orders[item].total_price,
                            foods : orders[item].foods,
                            shipper : orders[item].shipper, 
                            services : orders[item].services                   
                        };
                        resolve(OrderQuery);    
                    });
                })
            )  
        }
        Promise.all(listQuery)
        .then(function(listOrder){
            callback(listOrder);
        })
        .catch(function(err){
            console.log(err);
        })    
    });
}

var getShipperName = function(orderList,callback){
        var listQuery = [];
        for(var item in orderList){
            listQuery.push(
            new Promise(function(resolve,reject){
                    User.getUserById(orderList[item].shipper,function(err,user){
                        OrderQuery = {
                            user : orderList[item].user,
                            res_belong : orderList[item].res_belong,
                            status : orderList[item].status,
                            user_order : orderList[item].user_order,
                            time_ordered : orderList[item].time_ordered,
                            total_price : orderList[item].total_price,
                            foods : orderList[item].foods,
                            shipper : orderList[item].shipper, 
                            shipper_name : user.local.name, 
                            services : orderList[item].services                   
                        };
                        resolve(OrderQuery);    
                    });
                })
            )  
        }
        Promise.all(listQuery)
        .then(function(listOrder){
            callback(listOrder);
        })
        .catch(function(err){
            console.log(err);
        })  
}
/**Request
 * restaurant ID
 * */
/**Response
 * 
 */
router.get('/findOrderRes/:id',function(req,res){
    getOrderName(req.params.id,function(orderList){
        getShipperName(orderList,function(list){
            res.json({
                success : true,
                data : list,
            })
        })
    });
});

module.exports = router;