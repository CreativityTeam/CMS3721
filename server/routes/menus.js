var express = require('express');
var router = express.Router();
var Menu = require('../models/menu');

router.post('/create',function(req,res){
    var name = req.body.name;
    var newMenu = new Menu({
        name : name,  
    });
    Menu.createMenu(newMenu,function(err,newMenu){
        if(err) {
            res.json({
                message : err
            })
        }
        res.json({
           success : true,
           data : newMenu 
        })
    })
});

router.delete('/delete/:id',function(req,res){
    Menu.deleteMenu(req.params.id,function(err,newMenu){
        if(err) {
            res.json({
                message : err
            })
        }
        res.json({
           success : true,
           data : newMenu 
        })
    })
});

module.exports = router;