var request = require('request');
var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');
var url = require('url');
var qs = require('querystring');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    var path = url.parse(req.url).pathname;
    var fsCallback = function(error,data){
        if (error) throw error;
    }

    if (req.method == 'POST'){


    }

    switch(path){
        case '/venmo':
            // Webhooks verification 
            var url_parts = url.parse(req.url,true) 
            var query = url_parts.query;
            var queryString = JSON.stringify(query);
            var queryParsed = JSON.parse(queryString);
            var queryValue = queryParsed.venmo_challenge;
          

            if (queryValue)
                {
                res.writeHead(200, {
                    'Content-Length':body.length,
                    'Content-Type':'text/plain'});
                res.end(queryValue);
                console.log('Verification value = ' + queryValue);
                }
            else
                {
                        var data = '';
 
                        if (req.method == "POST") 
                        {
                            req.on('data', function(chunk) {
                              data += chunk;
                            });
                         
                            req.on('end', function() {
                                dataString = data.toString();
                                dataJson = JSON.parse(dataString);
                                dataParsed = dataJson.data;
                                dataStringify = JSON.stringify(dataParsed);
                                dataParsedJson = JSON.parse(dataString);
                                webhooksId = dataParsedJson.id;
                                webhooksStatus = dataParsedJson.status;
                                console.log('Received body data:');
                                console.log(dataParsed);
                                console.log('ID:');
                                console.log(webhooksId);
                                console.log('Status:');
                                console.log(webhooksStatus);
                            });
                        }
 
                          res.writeHead(200, {'Content-Type': 'text/plain'});
                          res.end();

                }

            var urlString = url.format(url_parts);
            ipOrigin = req.connection.remoteAddress;

            // var queryString = qs.format(query)
            
            console.log('origin = ' + ipOrigin)
            console.log('url = ' + urlString);
        break;
        default:
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(index);
        break;
    }


    // Print request pathname
    // var path = url.parse(req.url).pathname;
    // console.log('a request was received for: ' + path);
    
    

    

});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
    io.sockets.emit('time', { time: new Date().toJSON() });
}

// This will take a phone number, and make a 
function spamRequest(data) {
    venmoRequest(data);

}

// This works
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

// This works
function venmoRequest(number){
    console.log('Venmo request number: ');
    console.log(number);
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

// This is not working yet
function sendhubRequest(){

SENDHUB_API_KEY = '9e893891e0de6a833c06a5b5d9a2b3b5a08e103c' 
sendHubPostUrl = 'https://api.sendhub.com/v1/messages/?username=7652129586&api_key='+SENDHUB_API_KEY
headers = {'Content-type': 'application/json'}

    // # send = requests.post(sendHubPostUrl,data=data,headers=headers)    

}


// Send current time every 10 secs
// setInterval(sendTime, 3000);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Welcome!' });

    socket.on('i am client', console.log);
    socket.on('button', function(data){
        socket.emit('success',{successMessage:'You have sent a successful ______ request'});
        console.log(data);
        spamRequest(data);
    });
});

app.listen(8080);