var express = require('express');
var router = express.Router();
var Food = require('../models/food');

/**Request
 * body
 *  food_name
 *  res_belong
 *  description
 *  type
 *  price
 */
/**Response
 * food
 */
router.post('/create',function(req,res){
    var food_name = req.body.food_name;
    var res_belong = req.body.res_belong;
    var description = req.body.description;
    var type = req.body.type;
    var price = req.body.price;
    var photo1 = req.body.photo1;
    var photo2 = req.body.photo2;
    var photo3 = req.body.photo3;
    var photo4 = req.body.photo4;
    var photo5 = req.body.photo5;
    var newFood = new Food({
        food_name : food_name,
        description : description,
        res_belong : res_belong,
        type : type,
        price : price,
        photo1 : photo1,
        photo2 : photo2,
        photo3 : photo3,
        photo4 : photo4,
        photo5 : photo5
    });
    
    Food.createFood(newFood,function(err,food){
        if(err) console.log(err);
        res.json({
            success : true,
            msg : "Successfully Create Food",
            data : food 
        });
    });
});

/**Request 
 */
/**Response
 * foods
 */
router.get('/findinfo/all',function(req,res){
    Food.getAllFood(function(err,foods){
        if(err) console.log(err);
        res.json({
            success:true,
            data : foods
        });
    });
});

/**Request 
 * param
 *  id: Food ID
 */
/**Response
 * food
 */
router.get('/findinfo/:id',function(req,res){
    Food.getFoodById(req.params.id,function(err,food){
        if(err) console.log(err);
        res.json({
            success:true,
            data : food
        });
    });
});

/**Request 
 * param
 *  id: Food ID
 */
/**Response
 * food
 */
router.get('/findres/:id',function(req,res){
    Food.findRestaurant(req.params.id,function(err,food){
        if(err) console.log(err);
        res.json({
            success: true,
            msg: "Find done",
            data: food
        });
    });
});

/**Request 
 * param
 *  name: Food Name
 */
/**Response
 * foods
 */
router.get('/findfoodbyname/:name',function(req,res){
    Food.findFoodByName(req.params.name,function(err,foods){
        if(err) console.log(err);
        if(!foods){
            res.json({
                success:false,
                msg : "No food is found"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : foods
            });
        }
    });
});

/**Request 
 * param
 *  type: Food Type
 */
/**Response
 * foods
 */
router.get('/findfoodbytype/:type',function(req,res){
    Food.findFoodByType(req.params.type,function(err,foods){
        if(err) console.log(err);
        if(!foods){
            res.json({
                success:false,
                msg : "No food is found"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : foods
            });
        }
    });
});

/**Request 
 * param
 *  price: Food Price
 *  operator: greater than|less than|equal
 */
/**Response
 * foods
 */
router.get('/findfoodbyprice/:price/:operator',function(req,res){
    Food.findFoodByPrice(req.params.price,req.params.operator,function(err,foods){
        if(err) console.log(err);
        if(!foods){
            res.json({
                success:false,
                msg : "No food is found"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : foods
            });
        }
    });
});

/**Request 
 * param
 *  id: Food ID
 */
/**Response
 * food.comments
 */
router.get('/findcomment/:id',function(req,res){
    Food.findCommentsBelong(req.params.id,function(err,food){
        if(err) console.log(err);
        if(food.comments == null){
            res.json({
                success:false,
                msg : "Your Food has no comment"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : food.comments
            });
        }
    });
});

/**Request 
 * param
 *  id: Food ID
 */
/**Response
 * food.ratings
 */
router.get('/findrating/:id',function(req,res){
    Food.findRating(req.params.id,function(err,food){
        if(err) console.log(err);
        if(food.ratings == null){
            res.json({
                success:false,
                msg : "Your Restaurant has no rating"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : food.ratings
            });
        }
    });
});

/**Request 
 * param
 *  id: Food ID
 */
/**Response
 * food.photos
 */
router.get('/findphoto/:id',function(req,res){
    Food.findPhotosBelong(req.params.id,function(err,food){
        if(err) console.log(err);
        if(food.photos == null){
            res.json({
                success:false,
                msg : "Your Food has no photo"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : food.photos
            });
        }
    });
});


/**Request 
 * param
 *  id: Food ID
 *  idphoto: Photo ID
 */
/**Response
 */
router.put('/addphoto/:id/:idphoto',function(req,res){
    Food.getFoodById(req.params.id,function(err,food){
        if(err) console.log(err);
        food.photos.push(req.params.idphoto);
        Food.createFood(food,function(err,food){
            if(err) console.log(err);
            res.json({
                success : true,
                msg : "Successfully update",
                data : food
            });
        });
    });
});

/**Request 
 * param
 *  id: Food ID
 *  idcomment: Comment ID
 */
/**Response
 */
router.put('/addcomment/:id/:idcomment',function(req,res){
    Food.getFoodById(req.params.id,function(err,food){
        if(err) console.log(err);
        food.comments.push(req.params.idcomment);
        Food.createFood(food,function(err,food){
            if(err) console.log(err);
            res.json({
                success : true,
                msg : "Successfully update",
                data : food
            });
        });
    });
});

/**Request 
 * param
 *  id: Food ID
 *  idrating: Rating ID
 */
/**Response
 */
router.put('/addrating/:id/:idrating',function(req,res){
    Food.getFoodById(req.params.id,function(err,food){
        if(err) console.log(err);
        food.ratings.push(req.params.idrating);
        Food.createFood(food,function(err,food){
            if(err) console.log(err);
            res.json({
                success : true,
                msg : "Successfully update",
                data : food
            });
        });
    });
});

/**Request 
 * param
 *  id: Food ID
 * body
 *  food_name
 *  description
 *  type
 *  price
 */
/**Response
 */
router.put('/updateinfo/:id',function(req,res){
    Food.getFoodById(req.params.id,function(err,food){
        if(err) console.log(err);
        food.food_name = req.body.food_name;
        food.description = req.body.description;
        food.type = req.body.type;
        food.price = req.body.price;
        food.photo1 = req.body.photo1;
        food.photo2 = req.body.photo2;
        food.photo3 = req.body.photo3;
        food.photo4 = req.body.photo4;
        food.photo5 = req.body.photo5;
        Food.createFood(food,function(err,food){
            if(err) console.log(err);
            res.json({
                success : true,
                msg : "Successfully update",
                data : food
            });
        });
    });
});

/**Request 
 * param
 *  id: Food ID
 * body
 *  photo_id: Photo ID
 */
/**Response
 *  data: food.photos
 */
router.delete('/deletephoto/:id',function(req,res){
    Food.getFoodById(req.params.id,function(err,food){
        if(err) console.log(err);
        for(var i = 0;i < food.photos.length ; i++){
            if(food.photos[i] == req.body.photo_id){
                food.photos.splice(i,1);
            }
        }
        Food.createFood(food,function(err,food){
                if(err) console.log(err);
                res.json({
                    success : true,
                    msg : "Successfully Delete",
                    data : food.photos
            });
        });
    });
});

/**Request 
 * param
 *  id: Food ID
 */
/**Response
 */
router.delete('/deletefood/:id',function(req,res){
    Food.removeFood(req.params.id,function(err){
        if(err) console.log(err);
        res.json({
            success : true,
            msg : "Successfully Delete"
        });
    });
});

/**Request 
 * param
 *  id: Res ID
 */
/**Response
 * food.comments
 */
router.get('/findcommentres/:id',function(req,res){
    Food.findCommentsBelongRes(req.params.id,function(err,food){
        if(err) console.log(err);
        res.json({
                success:true,
                msg : "Find done",
                data : food
        });
    });
});

/**Get ResName */
router.get('/findResBelongName',function(req,res){
    Food.findResBelongName(function(err,listFood){
        res.json({
            success:true,   
            data : listFood
        })
    });
});
module.exports = router;