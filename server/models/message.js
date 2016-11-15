var mongoose = require('mongoose');
var MessageSchema = mongoose.Schema({
    senderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'    
    },
    receiverid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
    },
    time_created: {
        type: Date,
    }
});

var Message = module.exports = mongoose.model('Message',MessageSchema);

module.exports.addMessage = function(newMessage,callback){
    Message.save(callback);
};

module.exports.getMessageSender = function(id,callback){
    var query = { senderid : id};
    Message.find(query,callback);
};

module.exports.getMessageReceiver = function(id,callback){
    var query = { receiverid : id};
    Message.find(query,callback);
};

module.exports.deleteMessage = function(id,callback){
    var query = { _id : id };
    Message.findOneAndRemove(query,callback);
};