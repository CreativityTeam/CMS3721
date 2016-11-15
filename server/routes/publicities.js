var express = require('express');
var router = express.Router();
var Publicity = require('../models/publicity');

/**Request
 * body
 *  publicity_id
 *  publicity_name
 *  publicity_price
 * */
/**Response
 * publicity
 */

router.post('/create', function (req, res) {
    var publicity_name = req.body.publicity_name;
    var publicity_price = req.body.publicity_price;
    var newPublicity = new Publicity({
        publicity_name: publicity_name,
        publicity_price: publicity_price
    });

    Publicity.createPublicity(newPublicity, function (err, publicity) {
        if(err) throw err;
        res.json({
            success: true,
            msg: "Successfully Create Publicity",
            data: publicity
        });
    });
});

/**Request
 */
/**Response
 * All publicity
 */
router.get('/findAllPublicity', function (req, res) {
    Publicity.getAllPublicity(function (err, publicity){
        if(err) throw err;
        res.json({
            success: true,
            data: publicity
        });
    });
});

/**Request
 * param
 *  id: Publicity ID
 */
/**Response
 * publicity
 */
router.get('/findPublicity/:id', function (req, res) {
    Publicity.getPublicityById(req.params.id, function (err, publicity){
        if(err) throw err;
        res.json({
            success: true,
            data: publicity
        });
    });
});

/**Request
 * param
 *  Publicity name
 */
/**Response
 * publicity
 */
router.get('/findName/:name', function (req, res) {
    Publicity.getPublicityByName(req.params.name, function (err, publicity) {
        if(err) throw err;
        res.json({
            success: true,
            msg: "Publicity was found!",
            data: publicity
        });
    });
});

/**Request
 * param
 *  Publicity ID
 */
/**Response
 * Photos of this Publicity
 */
router.get('/findPhotos/:id', function (req, res) {
    Publicity.findPhotosBelong(req.params.id, function (err, publicity) {
        if(err) throw err;
        if(publicity.photos == null){
            res.json({
                success: true,
                msg: "No Photo was found!"
            })
        }else {
            res.json({
                success: true,
                msg: "Photo was found!",
                data: publicity.photos
            });
        }
    });
});

/**Request
 * param
 *  publicity_id
 *  body
 *  publicity_name
 * */
/**Response
 * publicity
 */
router.put('/updateinfo/:id', function (req, res) {
    Publicity.getPublicityById(req.params.id, function (err, publicity) {
        if(err) throw err;
        publicity.publicity_name = req.body.publicity_name;
        publicity.publicity_desciption = req.body.publicity_desciption;
        Publicity.createPublicity(publicity, function (err, publicity) {
            if(err) throw err;
            res.json({
                success : true,
                msg : "Update Successfully!",
                data : publicity
            });
        });
    });
});

/**Request
 * param
 *  publicity_id
 *  body
 *  publicity_price
 * */
/**Response
 * publicity
 */
router.put('/updateprice/:id', function (req, res) {
    Publicity.getPublicityById(req.params.id, function (err, publicity) {
        if(err) throw err;
        publicity.publicity_price = req.body.publicity_price;
        Publicity.createPublicity(publicity, function (err, publicity) {
            if(err) throw err;
            res.json({
                success : true,
                msg : "Update Successfully",
                data : publicity
            });
        });
    });
});

/**Request
 * param
 *  photo_id
 * */
/**Response
 * publicity
 */
router.put('/updatephoto/:id/:idphoto',function(req,res){
    Publicity.getPublicityById(req.params.id,function(err, publicity){
        if(err) throw err;
        publicity.photos.push(req.params.idphoto);
        Publicity.createPublicity(publicity,function(err){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Update Successfully!!"
            });
        });
    });
});

router.delete('/deletedesciption/:id', function (req, res) {
    Publicity.getPublicityById(req.params.id, function (err, publicity) {
        if(err) throw err;
        delete publicity.publicity_desciption;
        Publicity.createPublicity(publicity,function(err, publicity){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Delete Successfully",
                data: publicity.publicity_desciption
            });
        });
    });
});

router.delete('/deletephoto/:id',function(req,res){
    Publicity.getPublicityById(req.params.id,function(err,publicity){
        if(err) throw err;
        for(var i = 0;i < publicity.photos.length ; i++){
            if(publicity.photos[i] == req.body._id){
                publicity.photos.splice(i,1);
            }
        }
        Publicity.createPublicity(publicity,function(err,publicity){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Delete Successfully",
                data : publicity.photos
            });
        });
    });
});

router.delete('/deletepublicity/:id', function (req, res) {
    Publicity.removePublicity(req.params.id, function (err) {
        if(err) throw err;
        res.json({
            success: true,
            msg: "Delete successfully!"
        });
    });
});

module.exports = router;