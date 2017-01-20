var express = require('express');
var app = express();
var url = require('url');

/**Socket IO for real time location data exchange */
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){			
	var socketId = socket.id;
    console.log('Client id: ' + socketId + ' connected to io server'); 	                                	

    socket.on("disconnect", function () {
        console.log('Client id: ' + socketId + ' disconnected to io server');         
    });
});

app.use(function(req, res, next){	
	req.io = io;		
	next();
});

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
// app.listen(app.get('port'),function(){
//     console.log("Server is running at :", app.get('port'));
// })

server.listen(app.get('port'),function(){
    console.log("Server is running at :", app.get('port'));
})