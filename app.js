var express = require('express');
var app = express();

var main = require('./server/app');
app.use('/server/',main);
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/client/cms'));

app.get('*',function(req,res){
    res.sendFile(__dirname + '/client/cms/default.html');
});
/**Set port */
app.set('port',(process.env.PORT || 3000));
/**Set up Server */
app.listen(app.get('port'),function(){
    console.log("Server is running at :", app.get('port'));
})