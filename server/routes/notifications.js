const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

router.get('/getID/:id',function(req,res){
    Notification.getNotificationID(req.params.id,function(err,notification){
        if(err) console.log(err);
        notification.state = true;
        Notification.createNewNotification(notification,function(error,notificationUpdated){
            if(error) console.log(error);
            res.json({
                success: true,
                notification: notificationUpdated
            })
        });
    });
});

router.get('/getAllNotification',function(req,res){
    Notification.getAllNotification(function(err,AllNotification){
        if(err) console.log(err);
        res.json({
            success: true,
            allNotification: AllNotification
        })
    });
});

router.post('/createNewNotification',function(req){
    let io = req.io;
    let newNotification = new Notification({
        idRelated : req.body._id,
        content : "Notification for order ID " + req.body._id,
    });
    Notification.createNewNotification(newNotification,function(err,newNotificationFromDB){
        if(err) console.log(err);
        io.emit("newOderNotification",newNotificationFromDB);
    })
});

module.exports = router;
