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
    var publicity_desciption = req.body.publicity_desciption;
    var photo1 = req.body.photo1;
    var photo2 = req.body.photo2;
    var photo3 = req.body.photo3;
    var photo4 = req.body.photo4;
    var photo5 = req.body.photo5;
    var newPublicity = new Publicity({
        publicity_name: publicity_name,
        publicity_price: publicity_price,
        publicity_desciption : publicity_desciption,
        photo1 : photo1,
        photo2 : photo2,
        photo3 : photo3,
        photo4 : photo4,
        photo5 : photo5
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
        publicity.publicity_price = req.body.publicity_price;
        publicity.photo1 = req.body.photo1;
        publicity.photo2 = req.body.photo2;
        publicity.photo3 = req.body.photo3;
        publicity.photo4 = req.body.photo4;
        publicity.photo5 = req.body.photo5;
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