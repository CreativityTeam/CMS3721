var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var User = require('../models/user');
var jwt = require('jwt-simple');
var configAuth = require('../config/auth');

/**Input : Id Sender */
/**OutPut: List Outbox */
function getMesSender(id, callback) {
    var listMessage = [{
        idSender: String,
        nameReceiver: String,
        content: String,
        date: Date
    }];
    Message.getMessageSender(id, function (err, messageList) {
        if (err) console.log(err);
        var listQuery = [];
        for (var i in messageList) {
            listQuery.push(
                new Promise(function(resolve,reject){
                    User.getUserById(messageList[i].receiverid,function(err,User){
                        if(err) reject(err);
                        var message = {
                            idSender: id,
                            nameReceiver: User.local.name,
                            content: messageList.content,
                            date: messageList.time_created   
                        };
                        resolve(message);
                    });   
                })
            );
        }
        Promise.all(listQuery)
        .then(function(messageArray){
            listMessage.push(messageArray);
            callback(listMessage);
        })
        .catch(function (err){
            console.log(err);
        });
    });
};


/**Input : Id Receiver */
/**OutPut: List Inbox */
function getMesReceiver(id, callback) {
    var listMessage = [{
        idReceiver: String,
        nameSender: String,
        content: String,
        date: Date
    }];
    Message.getMessageReceiver(id, function (err, messageList) {
        if (err) console.log(err);
        var listQuery = [];
        for (var i in messageList) {
            listQuery.push(
                new Promise(function(resolve,reject){
                    User.getUserById(messageList[i].receiverid,function(err,User){
                        if(err) reject(err);
                        var message = {
                            idReceiver: id,
                            nameSender: User.local.name,
                            content: messageList.content,
                            date: messageList.time_created   
                        };
                        resolve(message);
                    });   
                })
            );
        }
        Promise.all(listQuery)
        .then(function(messageArray){
            listMessage.push(messageArray);
            callback(listMessage);
        })
        .catch(function (err){
            console.log(err);
        });
    });
};

router.get('/getMessSender/:id',function(req,res){
    getMesSender(req.params.id,function(listMessage){
        if (listMessage.length == 0) {
            res.json({
                success: false,
                msg: "You dont have any mails",
            });
        } else {
            res.json({
                success: true,
                msg: "Get Done",
                data: listMessage
            });
        }
    });
});

router.get('/getMessReceiver/:id',function(req,res){
    getMesReceiver(req.params.id,function(listMessage){
        if (listMessage.length == 0) {
            res.json({
                success: false,
                msg: "You dont have any mails",
            });
        } else {
            res.json({
                success: true,
                msg: "Get Done",
                data: listMessage
            });
        }
    });
});

router.post('/insertMess',function(req,res){
    var idSender = req.body.idsender;//*Get Id Sender
    var idReceiver = req.body.idreceiver;
    var content = req.body.content;
    var currentDate = new Date();
    var newDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset()*60000));
    var newMessage = new Message({
        senderid : idSender,
        receiverid : idReceiver,
        content : content,
        time_created : newDate
    });
    Message.addMessage(newMessage,function(err,message){
        if(err) console.log(err);
        res.json({
            success : true,
            msg : "Successfully Send Mail",
            data : message
        });
    });
});

router.delete('/deleteMess/:id',function(req,res){
    Message.deleteMessage(req.params.id,function(err){
        if(err) console.log(err);
        res.json({
            success : true,
            msg : "Successfully Delete"
        });
    });
});
module.exports = router;