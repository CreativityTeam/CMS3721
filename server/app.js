var express = require('express');
var app = express();
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var LocalStratery = require('passport-local').Stratery;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressvalidator = require('express-validator');
var flash = require('connect-flash');
var cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds048319.mlab.com:48319/mobileapp',function(err){
    if(err) throw ('Please check your connection');
    console.log('Connect DB Successfully');
});

/**Upload Folder */
app.use(express.static(__dirname + '/uploads'));
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();    
});

/**Body parser */
//* Its purpose to get value from client
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
/**Express session(Just define to user after)*/
app.use(session({
   secret: 'secret',
   saveUninitialized : true,
   resave : true
}));
/**Express validator */
//* Its purpose to validate the information of client
app.use(expressvalidator({
    errorFormatter: function(param,msg,value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

    while(namespace.length){
        formParam += '[' + namespace.shift() + ']';
    }
    return{
        param: formParam,
        msg : msg,
        value : value
        };
    }
}));

/**Route for model */
//* Its purpose to call api
var users = require('./routes/users');
var ratings = require('./routes/ratings');
var photos = require('./routes/photos');
var foods = require('./routes/foods');
var comments = require('./routes/comments');
var orders = require('./routes/orders');
var messages = require('./routes/messages');
var publicities = require('./routes/publicities');
var services = require('./routes/services');
var restaurants = require('./routes/restaurants');
var categories = require('./routes/categories');
var menus = require('./routes/menus');

/**URL for model */
//* Its purpose to call the right api for model
app.use('/api/users',users);
app.use('/api/ratings',ratings);
app.use('/api/photos',photos);
app.use('/api/comments',comments);
app.use('/api/foods',foods);
app.use('/api/orders',orders);
app.use('/api/messages',messages);
app.use('/api/publicities',publicities);
app.use('/api/services',services);
app.use('/api/restaurants',restaurants);
app.use('/api/categories',categories);
app.use('/api/menus',menus);
app.use('/checkconnection/',function(req,res){
    res.json({
        status : 200
    });
});

module.exports = app;