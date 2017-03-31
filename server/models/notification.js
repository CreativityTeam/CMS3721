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
        type : Boolean,
        default : false
    }
});
NotificationSchema.plugin(mongoose_timestamp);
let Notification = module.exports = mongoose.model('Notification',NotificationSchema);

/**Create new notification**/
module.exports.createNewNotification = (newNotification,callback) => newNotification.save(callback);
/**Get noditificationID**/
module.exports.getNotificationID = (id,callback) => Notification.findById(callback);
/**Get all notification**/
module.exports.getAllNotification = (callback) => Notification.find(callback);