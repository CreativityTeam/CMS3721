var mongoose = require('mongoose');
var CommentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    date_created: {
        type: Date        
    },
    date_modified: {
        type: Date        
    },
    is_reported: {
        type: Boolean,
        default: false
    }
});

var Comment = module.exports = mongoose.model('Comment',CommentSchema);

/**Create Comment */
module.exports.createComment = function(newComment,callback){
    newComment.save(callback);
};

module.exports.getCommentById = function(id,callback){
    Comment.findById(id,callback);
};

module.exports.getCommentByUserId = function(userId,callback){
    var query = {'user_id': userId}
    Comment.find(query,callback);
};

module.exports.getAllComment = function(callback){
    Comment.find(callback);
};

/**Find the User that create Comment */
module.exports.findUser = function(id,callback){
    Comment.findById(id).populate('user_id').exec(callback);
};

/**Remove Comment */
module.exports.removeComment = function(id,callback){
    Comment.findByIdAndRemove(id, callback);
};


