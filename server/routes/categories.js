var express = require('express');
var router = express.Router();
var Category = require('../models/category');

router.post('/create',function(req,res){
    var mainCategory = req.body.mainCategory;
    var name = req.body.user_order_id;
    var newCategory = new Category({
        mainCategory: mainCategory,
        name : name,  
    });
    Category.createCategory(newCategory,function(err,newCategory){
        if(err) {
            res.json({
                message : err
            })
        }
        res.json({
           success : true,
           data : newCategory 
        })
    })
});

router.get('/get/:id',function(req,res){
    var idCategory = req.params.id;
    Category.getCategory(idCategory,function(err,category){
        if(err) {
            res.json({
                message : err
            })
        }
        res.json({
           success : true,
           data : category 
        })
    })
});