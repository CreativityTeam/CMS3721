var express = require('express');
var router = express.Router();
var Photo = require('../models/photo');
var multer = require('multer');
var path = require('path')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storage });
var jwt = require('jwt-simple');
var fs = require('fs');
var configAuth = require('../config/auth');

router.post('/addphoto',upload.any(),function(req,res){
    if(req.files){
        req.files.forEach(function(file){
                var photo = new Photo();
                photo.url = 'uploads/' + file.filename;
                photo.description = req.body.decription;
                photo.userid = req.body.userid;
                Photo.addPhoto(photo,function(err,photo){
                if(err) console.log(err);
                res.json({
                    success : true,
                    msg : "Successfully Added"
                    });
                });
        });
    }
});

router.get('/findPhotoUser/:token',function(req,res){
    var token = req.params.token;
    var decoded = jwt.decode(token,configAuth.secret);
    Photo.findByUser(decoded._id,function(err,photos){
        res.json({
            success : true,
            data : photos
        });    
    });
});

router.delete('/removephoto/:id',function(req,res){
    Photo.remove(req.params.id,function(err){
        if(err) console.log(err);
        res.json({
            success : true,
            msg : "Successfully remove",
        });
    });
});

module.exports = router;