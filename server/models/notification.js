const mongoose = require('mongoose');
const mongoose_timestamp = require('mongoose-timestamp');
const NotificationSchema = mongoose.Schema({
    idRelated : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Order'
    },
    content : {
        type : String
    },
    state : {
        type : mongoose.Schema.Types.ObjectId,
        default : false
    }
});
NotificationSchema.plugin(mongoose_timestamp);
let Notification = module.exports = mongoose.model('Notification',NotificationSchema);

/**Create new notification**/
module.exports.createNewNotification = (newNotification,callback) => Notification.save(newNotification,callback);
/**Get noditificationID**/
module.exports.getNotificationID = (id,callback) => Notification.findById(id,callback);
/**Get all notification**/
module.exports.getAllNotification = (callback) => Notification.find(callback);