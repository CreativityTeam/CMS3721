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

router.put('/updateMenu/:id',function(req,res){
    Menu.findIdMenu(req.params.id,function(err,menu){
        if(err) console.log(err);
        menu.name = req.body.name
        Menu.createMenu(menu,function(err,menuSaved){
            if(err) {
                res.json({
                    message : err
                })
            }
            res.json({
                success : true,
                data : menuSaved 
            })
        })
    });
});

router.get('/getMenuID/:id',function(req,res){
    Menu.findIdMenu(req.params.id,function(err,menu){
        res.json({
           success : true,
           data : menu 
        })
    })
});

router.get('/getListMenu',function(req,res){
    Menu.getMenu(function(err,listMenu){
        res.json({
           success : true,
           data : listMenu 
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