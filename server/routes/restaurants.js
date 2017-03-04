var express = require('express');
var router = express.Router();
var configAuth = require('../config/auth');
var Restaurant = require('../models/restaurant');
var jwt = require('jwt-simple');

router.post('/register',function(req,res){
    var userid = req.body._id;
    var res_name = req.body.name;
    var housenumber = req.body.housenumber;
    var street = req.body.street;
    var district = req.body.district;
    var city = req.body.city;
    var type = req.body.type;
    var description = req.body.description;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var photo1 = req.body.photo1;
    var photo2 = req.body.photo2;
    var photo3 = req.body.photo3;
    var photo4 = req.body.photo4;
    var photo5 = req.body.photo5;
    var delivery = req.body.delivery;
    var codesiret = req.body.codesiret;
    var postalcode = req.body.postalcode;
    var timeopen = req.body.timeopen;
    var newRestaurant = new Restaurant({
        user_id : userid,
        res_name : res_name,
        description : description,
        codesiret : codesiret,
        timeopen : timeopen,
        location:{
            housenumber : housenumber,
            street : street,
            district : district,
            city : city,
            postalcode : postalcode,
            point: {
                longitude : longitude,
                latitude : latitude
            }
        },
        delivery : delivery,
        type : type,
        photo1 : photo1,
        photo2 : photo2,
        photo3 : photo3,
        photo4 : photo4,
        photo5 : photo5
    });
    Restaurant.createRestaurant(newRestaurant,function(err,restaurant){
        if(err) console.log(err);
            res.json({
                success : true,
                msg : "Successfully Create Restaurant",
                data : restaurant 
            });
    });
});

/**Input : Type ID */
/**Output : restaurant belong type */
router.get('/findresbytype/:type',function(req,res){
    Restaurant.findResByType(req.params.type,function(err,restaurantList){
        if(err) console.log(err);
            res.json({
                success:true,
                msg : "Find done",
                data : restaurantList
            });
    });
});

/**Input : Restaurant ID */
/**Output : restaurant information */
router.get('/findinfo/:id',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        res.json({
            success:true,
            data : restaurant
        });
    });
});

/**Input : User ID */
/**Output : Admin of Rrestaurant */
router.get('/findad/:token',function(req,res){
    var token = req.params.token;
    var decoded = jwt.decode(token,configAuth.secret);
    Restaurant.findAdmin(decoded._id,function(err,restaurant){
        if(err) console.log(err);
        if(restaurant.length == 0){
            res.json({
                success:false,
                msg : "Veuillez créer votre premier restaurant"
            });    
        }else{
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant
            });
        }
    });
});

/**Input : Restaurant ID *(not necessary)/
/**Output : User of Rrestaurant */
router.get('/finduser/:id',function(req,res){
    Restaurant.findUserBelong(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        res.json({
            success: true,
            msg: "Find done",
            data: restaurant.user_id
        });
    });
});

/**Input : Name res*/
/**Output : List Restaurants */
router.get('/findres',function(req,res){
    Restaurant.findRes(function(err,restaurant){
        if(err) console.log(err);
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant
            });
    });
});

/**Input : Restaurant ID */
/**Output : commend of Rrestaurant */
router.get('/findcomment/:id',function(req,res){
    Restaurant.findCommentOfRestaurant(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        res.json({
                success:true,
                msg : "Find done",
                data : restaurant.comments
        });
    });
});

/**Input : Restaurant ID */
/**Output : Rating of Rrestaurant */
router.get('/findrating/:id',function(req,res){
    Restaurant.findRating(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        res.json({
                success:true,
                msg : "Find done",
                data : restaurant.ratings
        });
    });
});


/**Input : Restaurant ID */
/**Output : Publicities of Rrestaurant */
router.get('/findpublicity/:id',function(req,res){
    Restaurant.findPublicitiesBeLong(req.params.id,function(err,restaurant){
        if(err) console.log(err);
            res.json({
                success:true,
                msg : "Find done",
                data : restaurant.publicities
            });
    });
});

/**Input : ID comments */
/**Output : Array Restaurant */
router.put('/updatecomment/:id/:idcomment',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        restaurant.comments.push(req.params.idcomment);
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) console.log(err);
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

/**Input : ID ratings */
/**Output : Array Restaurant */
router.put('/updaterating/:id',function(req,res){    
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        var exist = false; 
        for (var i = 0;  i < restaurant.ratings.length; ++i){
            if (restaurant.ratings[i].userId == req.body.userId){                   
                restaurant.totalRating = restaurant.totalRating - restaurant.ratings[i].score + req.body.score;                
                restaurant.ratings[i].score = req.body.score;                
                exist = true;
                break;
            }
        }
        if (!exist){
            restaurant.ratings.push({'userId': req.body.userId, 'score': req.body.score});
            restaurant.totalRating += req.body.score;            
        }                  
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) console.log(err);
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

/**Input : ID publicities */
/**Output : Array Restaurant */
router.put('/updatepublicities/:id/:idpublicity',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        restaurant.publicities.push(req.params.idpublicity);
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) console.log(err);
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

/**Input : ID Restaurant */
/**Output : Restaurant */
router.put('/updateinfo/:id',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        restaurant.res_name = req.body.name;
        restaurant.description = req.body.description;
        restaurant.photo1 = req.body.photo1;
        restaurant.photo2 = req.body.photo2;
        restaurant.photo3 = req.body.photo3;
        restaurant.photo4 = req.body.photo4;
        restaurant.photo5 = req.body.photo5;
        restaurant.delivery = req.body.delivery;
        restaurant.type = req.body.type;
        restaurant.timeopen = req.body.timeopen;
        restaurant.codesiret = req.body.codesiret;
        restaurant.location.housenumber = req.body.housenumber;
        restaurant.location.street = req.body.street;
        restaurant.location.district = req.body.district;
        restaurant.location.city = req.body.city;
        restaurant.location.postalcode = req.body.postalcode;
        restaurant.location.point.longitude = req.body.longitude;
        restaurant.location.point.latitude = req.body.latitude;
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) console.log(err);
            res.json({
                success : true,
                msg : "Successfully update",
                data : restaurant
            });
        });
    });
});

router.delete('/deletecomment/:id/:idcomment',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        for(var i = 0;i < restaurant.comments.length ; i++){
            if(restaurant.comments[i] == req.params.idcomment){
                restaurant.comments.splice(i,1);
            }
        }
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
                if(err) console.log(err);
                    res.json({
                        success : true,
                        msg : "Successfully Delete",
                        data : restaurant.comments
            });
        });
    });
});

router.delete('/deletepublicity/:id/:idpublicity',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        for(var i = 0;i < restaurant.publicities.length ; i++){
            if(restaurant.publicities[i] == req.params.idpublicity){
                restaurant.publicities.splice(i,1);
            }
        }
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
                if(err) console.log(err);
                res.json({
                    success : true,
                    msg : "Successfully Delete",
                    data : restaurant.publicities
            });
        });
    });
});

router.delete('/deleterestaurant/:id',function(req,res){
    Restaurant.deleteRestaurant(req.params.id,function(err){
        if(err) console.log(err);
        res.json({
            success : true,
            msg : "Successfully Delete"
        });
    });
});

router.get('/getAllPublicity',function(req,res){
    Restaurant.getAllPublicity(function(err,listPublicity){
        res.json({
            success : true,
            data : listPublicity
        })
    });
});

/**Input : ID menu */
/**Output : Array menu */
router.put('/updatemenu/:id/:idmenu',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        restaurant.menus.push(req.params.idmenu);
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
            if(err) console.log(err);
            res.json({
                success : true,
                data : restaurant,
                msg : "Successfully update"
            });
        });
    });
});

router.delete('/deletemenu/:id/:idmenu',function(req,res){
    Restaurant.getRestaurantById(req.params.id,function(err,restaurant){
        if(err) console.log(err);
        for(var i = 0; i < restaurant.menus.length; i++){
            if(restaurant.menus[i]._id == req.params.idmenu){
                restaurant.menus.splice(i,1);
            }
        }
        Restaurant.createRestaurant(restaurant,function(err,restaurant){
                if(err) console.log(err);
                    res.json({
                        success : true,
                        msg : "Successfully Delete",
                        data : restaurant.menus
            });
        });
    });
});

router.get('/getListMenu/:id',function(req,res){
    Restaurant.findResMenu(req.params.id,function(err,restaurant){
        if(err) console.log(err);
            res.json({
                success : true,
                data : restaurant,
            });
    });
});

module.exports = router;