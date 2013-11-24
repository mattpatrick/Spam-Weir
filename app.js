var request = require('request');
var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
    io.sockets.emit('time', { time: new Date().toJSON() });
}

// This function sends a pystmark request
function sendEmail() {
	var postmark = require("postmark")("1ec2a3f4-3601-4792-b9dc-a1bbeb6258c5");
    postmark.send({
        "From": "info@spamweir.com", 
        "To": "matthewleepatrick@gmail.com", 
        "Subject": "Test", 
        "TextBody": "Test Message"
    }
        , function(error, success) {
        if(error) {
            console.error("Unable to send via postmark: " + error.message);
            return;
        }
        console.info("Sent to postmark for delivery")
    });
}

function venmoRequest(){

var request = require("request");
 
	request({
	  uri: "https://sandbox-api.venmo.com/payments",
	  method: "POST",
	  form: {"access_token": "dymsdHqxz38vBueFznYaRzUzQtDdzK2H", "note" : "Test", "amount" : "0.1",  "phone" : "15555555555"
	  }
	}, function(error, response, body) {
	  console.log(body);
	});

}

// Send current time every 10 secs
// setInterval(sendTime, 3000);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Welcome!' });

    socket.on('i am client', console.log);
    socket.on('button', function(){
    	socket.emit('success',{successMessage:'You have sent a successful ______ request'});
    	sendEmail();
    	venmoRequest();
    });
});

app.listen(3000);