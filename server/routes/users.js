var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var configAuth = require('../config/auth');
var cors = require('cors');
var jwt = require('jwt-simple');
const generator = require('generate-password');
const nodemailer = require('nodemailer');

router.post('/register',function(req,res){
    var email = req.body.email;
    var name = req.body.firstname + " " + req.body.lastname;
    var password = req.body.password
    var password2 = req.body.password2;
    var role = req.body.role;
    var newUser = new User({
        local: {
            email: email,
            name: name,
            password: password
        },
        role : role
    });
    User.getUserByEmail(newUser.local.email, function (err, user) {
        if (err) res.status(500).send();
        if (user) {
            res.json({
                success: false,
                msg: 'This email is registered'
            });
        } else {
            User.createUser(newUser, function (err, user) {
                if (err) {
                    res.status(500).send();
                } else {
                    var token = jwt.encode(user, configAuth.secret);
                    res.json({
                        success: true,
                        msg: 'Successfully create account',
                        token: token
                    });
                }
            });
        }
    });
});

/**Local Authetication */
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByEmail(username, function (err, user) {
            if (err) console.log(err);
            if (!user) {
                return done(null, false);
            }
            if (User.comparePassword(password, user.local.password)) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
}));


/**Login function */
router.post('/login',function(req,res,next){
   passport.authenticate('local',function(err,user){
       if(err) return next(err);
       if(!user){
            return res.json({
                success : false,
                msg : 'Please check your username or password'
            });   
       }else{
           User.getUserById(user._id,function(err,newuser){
               if(err) console.log(err);
               var currentDate = new Date();
               var newDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset()*60000));
               newuser.last_login = newDate;
               User.updateUser(newuser,function(err,newuser){
                    var token = jwt.encode(newuser, configAuth.secret);
                    return res.json({
                        success : true,
                        msg : 'Login successful',
                        token : token
                    });    
               });
           });
       }
   })(req, res, next);
});

/**Login with facebook */
router.post('/createFace',function(req,res){
    User.getUserByFacebookId(req.body.id,function(err,user){
        var currentDate = new Date();
        var newDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset()*60000));
        if(err) console.log(err);
        if(user){
            user.last_login = newDate;
            User.updateUser(user,function(err,newuser){
                var token = jwt.encode(newuser, configAuth.secret);
                res.json({
                    success : true,
                    msg : 'Login successful',
                    token : token
                  });    
               });
        }else{
            var id = req.body.id;
            var name = req.body.name;
            var email = req.body.email;
            var gender = req.body.gender;
            var avatar = req.body.picture.data.url;
            var newUser = new User({
                local : {
                    email : email,
                    name : name
                },
                avatar : avatar,
                gender : gender,
                facebook : {
                    id : id,
                    name : name
                },
                last_login : newDate
            }); 
            User.createUserOther(newUser,function(err,newuser){
                if(err){
                    res.status(500).send();
                }else{
                    var token = jwt.encode(newuser, configAuth.secret);
                    res.json({
                        success : true,
                        msg : 'Successfully create account',
                        token : token
                    });
                }
            });
        }
    });
});

router.put('/changeRole/:id',function(req,res){
    User.getUserById(req.params.id,function(err,user){
        if(err) console.log(err);
        user.role = req.body.role;
        User.updateUser(user,function(err,user){
            res.json({
                success : true,
                msg : "Successfully update",
                data : user
            });
        });
    });       
})

/**Get all user */
router.get('/findUserAll',function(req,res){
    User.getAllUser(function(err,users){
        if(err) console.log(err);
        if(users){
            res.json({
                success : true,
                data : users
            });
        }
    });    
});

/**Get user id */
router.get('/findUserID/:id',function(req,res){
    User.getUserById(req.params.id,function(err,user){
        if(err) console.log(err);
        res.json({
                success : true,
                data : user
            });
        });
});

/**Search Name */
router.get('/find/:name',function(req,res){
    User.findUserByName(req.params.name,function(err,users){
        if(err) console.log(err);
        if(users){
            res.json({
                success : true,
                data : users
            });
        }else{
            res.json({
                success : false,
                msg : "No User Found"
            });
        }
    });    
});

router.get('/findone/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.getUserById(decoded._id,function(err,user){
        if(err) console.log(err);
        res.json({
                success : true,
                data : user
            });
        });
    }
});

router.put('/update/:id',function(req,res){
        User.getUserById(req.params.id,function(err,user){
        if(err) console.log(err);
        user.avatar = req.body.avatar;
        user.gender = req.body.gender;
        user.birthday = req.body.birthday;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.about = req.body.about;
        user.other = req.body.other;
        User.updateUser(user,function(err,user){
                if(err) console.log(err);
                res.json({
                    success : true,
                    data : user,
                    msg : "Successfully Updated"
                });
            });
        });
});

router.put('/addresfav/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.getUserById(decoded._id,function(err,user){
        if(err) console.log(err);
        user.res_favorite.push(req.body._id);
        User.updateUser(user,function(err,user){
                if(err) console.log(err);
                res.json({
                    success : true,
                    data : user,
                    msg : "Successfully Updated"
                });
            });
        });
    }
});

router.put('/addfoodfav/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.getUserById(decoded._id,function(err,user){
        if(err) console.log(err);
        user.foods_favorite.push(req.body._id);
        User.updateUser(user,function(err,user){
                if(err) console.log(err);
                res.json({
                    success : true,
                    data : user,
                    msg : "Successfully Updated"
                });
            });
        });
    }
});

router.get('/findresfav/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.findResFav(decoded._id,function(err,user){
            if(err) console.log(err);
            if(user.res_favorite.length == 0){
                res.json({
                    success : false,
                    msg : "You dont like any restaurants"
                });
            }else{
                res.json({
                    success : true,
                    data : user
                });
            }
        });
    }
});

router.get('/findfoodfav/:token',function(req,res){
    var token = req.params.token;
    if(token){
        var decoded = jwt.decode(token,configAuth.secret);
        User.findFoodFav(decoded._id,function(err,user){
            if(err) console.log(err);
            if(user.foods_favorite.length == 0){
                res.json({
                    success : false,
                    msg : "You dont like any foods"
                });
            }else{
                res.json({
                    success : true,
                    data : user
                });
            }
        });
    }
});

router.delete('/deleteFoodFav/:token/:idfood',function(req,res){
    var token = req.params.token;
    var decoded = jwt.decode(token,configAuth.secret);
    User.getUserById(decoded._id,function(err,user){
        if(err) console.log(err);
        for(var i in user.foods_favorite){
            if(user.foods_favorite[i] == req.params.idfood){
                user.foods_favorite.splice(i,1);
            }
        }
        User.updateUser(user,function(err,user){
            if(err) console.log(err);
            res.json({
                success : true,
                msg : "Delete Successfully",
            });
        });
    });
});

router.delete('/deleteResFav/:token/:idres',function(req,res){
    var token = req.params.token;
    var decoded = jwt.decode(token,configAuth.secret);
    User.getUserById(decoded._id,function(err,user){
        if(err) console.log(err);
        for(var i in user.res_favorite){
            if(user.res_favorite[i] == req.params.idres){
                user.res_favorite.splice(i,1);
            }
        }
        User.updateUser(user,function(err,user){
            if(err) console.log(err);
            res.json({
                success : true,
                msg : "Delete Successfully",
            });
        });
    });
});

router.get('/isshipping/:shipperId',function(req,res){    
    User.getUserById(req.params.shipperId,function(err,shipper){
        if(err) console.log(err);
        console.log(shipper.shipping);
        res.json({
            success : true,
            data : shipper.shipping,
        });
    });
});

router.post('/resetpassword',function(req,res){
    User.getUserByEmail(req.body.username,(err,user) => {
        if(err) console.log(err)
        if(!user){
            res.json({
                success: false,
                msg : "Your email is not registered"
            })
        }else{
                var password = generator.generate({
                    length: 11,
                    numbers: true
                });
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'nhatndm1193@gmail.com',
                        pass: 'Nhatnguyen0408'
                    }
                });
                let mailOptions = {
                    from: '"Admin" <nhatndm1193@gmail.com>', // sender address
                    to: req.body.username, // list of receivers
                    subject: 'Reset Password ✔', // Subject line
                    html: '<b>Please use this password to reset password: ' + password + '</b>' // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
                user.local.password = password;
                User.resetPassword(user, (err,user) => {
                    if(err) console.log(err)
                    res.json({
                        success : true,
                        msg : "Please use password in your email to reset your password!!"
                    })
                }) 
        }
    })
})
module.exports = router;