var express = require('express');
var router = express.Router();
var Rating = require('../models/rating');

router.post('/addrating',function(req,res){
    var newRating = new Rating();
    newRating.score = req.body.score;
    Rating.addRating(newRating,function(err,newRating){
        if(err) console.log(err);
        res.json({
            success : true,
            data : newRating
        });
    });
});

router.get('/getrating/:id',function(req,res){
    Rating.getRatingById(req.params.id,function(err,rating){
        if(err) console.log(err);
        res.json({
            data : rating.score    
        });
    });
});

module.exports = router;