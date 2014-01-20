var request = require('request');
var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html'),
        wait = fs.readFileSync(__dirname + '/wait.html');
var url = require('url');
var qs = require('querystring');
var Parse = require('parse').Parse;

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    var path = url.parse(req.url).pathname;
    var fsCallback = function(error,data){
        if (error) throw error;
    }

    if (req.method == 'POST'){


    }

    switch(path){
        case '/wait':
                console.log('In wait')
                var url_parts = url.parse(req.url, true);
                var query = url_parts.query;
                var queryString = JSON.stringify(query);
                var queryParsed = JSON.parse(queryString);
                var queryValue = queryParsed.phone;
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(wait);

                venmoRequest(queryValue);
                //console.log('transactionid: ' + transactionId);
                holdAndCall(queryValue);

                function holdAndCall(phoneNum){
                        setTimeout(function(){console.log('holding for 5 seconds');queryParse(phoneNum,res);},5000);
                }

                function queryParse(phoneNum){
                        Parse.initialize("mQahqHqIEatXfIJBvRORQMEYP924WcHQWYefEiKw", "Nb1L5nL4JFCKy9pCAE3mvUXWDL3SgCUpn8SqnLMF");
                        var SpamObject = Parse.Object.extend("Spam");
                        var query = new Parse.Query(SpamObject);
                        query.descending("createdAt");
                        query.equalTo("phone",phoneNum);        
                        query.first({
                                  success: function(object) {
                                            console.log('Got the object');
                                        paid = object.get('Paid');
                                        console.log('Paid in query: ' + paid);
                                        if (paid){
                                                console.log('it is all paid');
                                                io.sockets.emit('paid', { message: 'You paid wahoo!' });
                                                //console.log(res);
                                        }
                                        else{
                                                holdAndCall(phoneNum);
                                        }
                                 },
                                  error: function(error) {
                                            alert("Error: " + error.code + " " + error.message);
                                  }
                        });
                }

                //doIt(queryValue);                

                

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
                                dataParsedJson = JSON.parse(dataStringify);
                                webhooksId = dataParsedJson.id;
                                webhooksStatus = dataParsedJson.status;

                                updateTransactionStatus(webhooksId,webhooksStatus);

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

function updateTransactionStatus(transactionId, transactionStatus){
    Parse.initialize("mQahqHqIEatXfIJBvRORQMEYP924WcHQWYefEiKw", "Nb1L5nL4JFCKy9pCAE3mvUXWDL3SgCUpn8SqnLMF");
        var SpamObject = Parse.Object.extend("Spam");
        var query = new Parse.Query(SpamObject);
        
        if (transactionStatus == "settled"){
            query.descending("createdAt");
            query.equalTo("transactionIDNum",transactionId);    
            query.first({
                success: function(object) {
                        console.log('Status updated to: ' +transactionStatus);
                        object.set("Status",transactionStatus);
                        
                        object.set("Paid",true);
                        
                        object.save();
    
                   },
                error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                }
            });
        }
}

// This works
function venmoRequest(number){
    console.log('Venmo request number: ');
    console.log(number);
        transaction = "";

    var request = require("request");
 
    request({
      uri: "https://sandbox-api.venmo.com/v1/payments",
      method: "POST",
      
      // form: {"access_token": "dymsdHqxz38vBueFznYaRzUzQtDdzK2H", "note" : "Test02", "amount" : "-1",  "phone" : number
      form: {"access_token": "dymsdHqxz38vBueFznYaRzUzQtDdzK2H", "note" : "Test", "amount" : "0.1",  "user_id" : "153136"
      }
    }, function(error, response, body) {
        //Parse response json to get the transaction ID
        // var responseString = JSON.stringify(body);
        var responseParsed = JSON.parse(body);
        var transactionId = responseParsed.id;
    
        // console.log(response);
        // console.log("Target user Id is");
        // console.log(transactionId);
        
    Parse.initialize("mQahqHqIEatXfIJBvRORQMEYP924WcHQWYefEiKw", "Nb1L5nL4JFCKy9pCAE3mvUXWDL3SgCUpn8SqnLMF");
                var SpamObject = Parse.Object.extend("Spam");
                    var spamObject = new SpamObject();
                      spamObject.save({phone: number,Paid: false, transactionIDNum: transactionId}, {
                              success: function(object) {
                        console.log('saved new object');
                              },
                              error: function(model, error) {
                        console.log(error);
                              }
                    });
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
        

        number = data.number;
        console.log(number);
        spamRequest(number);
    });
});

app.listen(8080);