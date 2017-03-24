/**
 * Created by K on 11/1/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../models/service');
var Comment = require('../models/comment');

/**Request
 * body
 *  service_id
 *  service_name
 *  service_price
 * */
/**Response
 * service
 */

router.post('/create', function (req, res) {
    var service_name = req.body.service_name;
    var service_desciption = req.body.service_desciption;
    var category = req.body.category;
    var housenumber = req.body.housenumber;
    var street = req.body.street;
    var district = req.body.district;
    var city = req.body.city;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var photo1 = req.body.photo1;
    var photo2 = req.body.photo2;
    var photo3 = req.body.photo3;
    var photo4 = req.body.photo4;
    var photo5 = req.body.photo5;
    var codesiret = req.body.codesiret;
    var postalcode = req.body.postalcode;
    var timeopen = req.body.timeopen;
    var country = req.body.country;
    var newService = new Service({
        service_name: service_name,
        service_desciption : service_desciption,
        category : category,
        codesiret : codesiret,
        timeopen : timeopen,
        location:{
            housenumber : housenumber,
            street : street,
            district : district,
            city : city,
            country :country,
            postalcode : postalcode,
            point: {
                longitude : longitude,
                latitude : latitude
            }
        },
        photo1 : photo1,
        photo2 : photo2,
        photo3 : photo3,
        photo4 : photo4,
        photo5 : photo5
    });
    Service.createService(newService, function (err, service) {
        if (err) console.log(err);
        res.json({
            success: true,
            msg: "Successfully Create Service",
            data: service
        });
    });
});

/**Request
 * param
 *  service_id
 * */
/**Response
 * service
 */

router.get('/findinfo/:id', function (req, res) {
    Service.getServiceById(req.params.id, function (err, service) {
        if (err) console.log(err);
        res.json({
            success: true,
            data: service
        });
    });
});

/**Request
 * param
 *  service_name
 * */
/**Response
 * service
 */

router.get('/findname/:name', function (req, res) {
    Service.getServiceByName(req.params.name, function (err, service) {
        if (err) console.log(err);
        res.json({
            success: true,
            data: service
        });
    });
});

/**Request
 * param
 *  service_id
 *  body
 *  service_name
 *  service_desciption
 *  servce_price
 * */
/**Response
 * service
 */
router.put('/updateinfo/:id', function (req, res) {
    Service.getServiceById(req.params.id, function (err, service) {
        if (err) console.log(err);
        service.service_name = req.body.service_name;
        service.service_desciption = req.body.service_desciption;
        service.category = req.body.category;
        service.location = {
            housenumber : req.body.housenumber,
            street : req.body.street,
            district : req.body.district,
            city : req.body.city,
            country : req.body.country,
            postalcode : req.body.postalcode,
            point: {
                longitude : req.body.longitude,
                latitude : req.body.latitude
            }
        };
        service.photo1 = req.body.photo1;
        service.photo2 = req.body.photo2;
        service.photo3 = req.body.photo3;
        service.photo4 = req.body.photo4;
        service.photo5 = req.body.photo5;
        service.timeopen = req.body.timeopen;
        service.codesiret = req.body.codesiret;
        Service.createService(service, function (err, service) {
            if (err) console.log(err);
            res.json({
                success: true,
                msg: "Update Successfully!",
                data: service
            });
        });
    });
});

/**Request
 * param
 *  service_name
 * */
/**Response
 * service
 */

router.get('/findall', function (req, res) {
    Service.findAll(function(err,service){
        if(err) console.log(err);
        res.json({
            success : true,
            data : service
        });
    });
});

router.delete('/deleteservice/:id', function (req, res) {
    Service.removeService(req.params.id, function (err) {
        if (err) console.log(err);
        res.json({
            success: true,
            msg: "Delete successfully!"
        });
    });
});

/**Request
 * param
 *  service_id
 * */
/**Response
 * service
 */

router.get('/findcategory/:id', function (req, res) {
    Service.findCategory(req.params.id, function (err, service) {
        if (err) console.log(err);
        res.json({
            success: true,
            data: service
        });
    });
});

/**Input : ID comments */
/**Output : Array Restaurant */
router.put('/addcomment/:id/:idcomment',function(req,res){
    Service.getServiceById(req.params.id,function(err,service){
        if(err) console.log(err);
        service.comments.push(req.params.idcomment);
        Comment.findUser(req.params.idcomment, function(err, comment){
			if(err) console.log(err);
            Service.createService(service,function(err,service){
                if(err) console.log(err);
                res.json({
                    success : true,
                    data : comment,
                    msg : "Successfully update"
                });
            });
        });
    });
});

/**Input : ID ratings */
/**Output : Array Restaurant */
router.put('/updaterating/:id',function(req,res){    
    Service.getServiceById(req.params.id,function(err,service){
        if(err) console.log(err);
        var exist = false; 
        for (var i = 0;  i < service.ratings.length; ++i){
            if (service.ratings[i].userId == req.body.userId){                   
                service.totalRating = service.totalRating - service.ratings[i].score + req.body.score;                
                service.ratings[i].score = req.body.score;                
                exist = true;
                break;
            }
        }
        if (!exist){
            service.ratings.push({'userId': req.body.userId, 'score': req.body.score});
            service.totalRating += req.body.score;            
        }                  
        Service.createService(service,function(err,service){
            if(err) console.log(err);
            res.json({
                success : true,
                data : service,
                msg : "Successfully update"
            });
        });
    });
});

module.exports = router;
