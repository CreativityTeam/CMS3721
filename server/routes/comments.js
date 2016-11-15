var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');

/**Request 
 * body 
 *  user_id
 *  content
 * */
/**Response 
 * data: comment
*/
router.post('/create',function(req,res){
    var currentDate = new Date();
    var newDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset()*60000));
    var user_id = req.body.user_id;
    var content = req.body.content;    
    var newComment = new Comment({
        user_id : user_id,
        content : content,
        date_created: newDate
    });
    
    Comment.createComment(newComment,function(err,comment){
        if(err) throw err;
        res.json({
            success : true,
            msg : "Successfully Create Comment",
            data : comment 
        });
    });
});

/**Request  
 * */
/**Response 
 * data: comments
*/
router.get('/findcomments/all',function(req,res){
    Comment.getAllComment(function(err,comments){
        if(err) throw err;
        res.json({
            success:true,
            data : comments
        });
    });
});

/**Request 
 * param 
 *  user_id
 * */
/**Response 
 * data: comments
*/
router.get('/findcomments/:user_id',function(req,res){
    Comment.getCommentByUserId(req.params.user_id,function(err,comments){
        if(err) throw err;
        res.json({
            success:true,
            data : comments
        });
    });
});

/**Request 
 * param 
 *  id
 * */
/**Response 
 * data: comment
*/
router.get('/findcomment/:id',function(req,res){
    Comment.getCommentById(req.params.id,function(err,comment){
        if(err) throw err;
        res.json({
            success:true,
            data : comment
        });
    });
});


/**Request 
 * param 
 *  id
 * */
/**Response 
 * data: comment.user_id
*/
router.get('/finduser/:id',function(req,res){
    Comment.findUser(req.params.id,function(err,comment){
        if(err) throw err;
        res.json({
            success: true,
            msg: "Find done",
            data: comment.user_id
        });
    });
});

/**Request 
 * body 
 *  content
 *  is_reported
 * */
/**Response 
 * data: comment
*/
router.put('/updateinfo/:id',function(req,res){
    var currentDate = new Date();
    var newDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset()*60000));
    Comment.getCommentById(req.params.id,function(err,comment){
        if(err) throw err;        
        if (req.body.content){
            comment.content = req.body.content;
        }
        if (req.body.is_reported){
            comment.is_reported = req.body.is_reported;
        }

        comment.date_modified = newDate;
        Comment.createComment(comment,function(err,comment){
            if(err) throw err;
            res.json({
                success : true,
                msg : "Successfully update",
                data : comment
            });
        });
    });
});

/**Request 
 * param 
 *  id
 * */
/**Response 
*/
router.delete('/deletecomment/:id',function(req,res){
    Comment.removeComment(req.params.id,function(err){
        if(err) throw err;
        res.json({
            success : true,
            msg : "Successfully Delete"
        });
    });
});

module.exports = router;