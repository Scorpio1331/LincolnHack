var http = require('http');
var port = process.env.port || 1337;
var fs = require('fs');
var url = require('url');
    

http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    var path = url.parse(req.url).pathname;
    if (path == "/gettweets") {
        res.writeHead(200, { "Content-Type": "text/JSON" });
        //Callback functions
        var error = function (err, res, body) {
            console.log('ERROR [%s]', err.message);
        };
        var success = function (data) {
            
            res.end(data);
        };

        var Twitter = require('twitter-node-client').Twitter;

        var config = {
            "consumerKey": "gwh4Oc5Tnwnx8Iwdq9aP1ltAJ",

            "consumerSecret": "jIzA3dAFVPLq3qeMzdJEQY9XvSJdx1FiQfwk0H97zewMwDyCYt",

            "accessToken": "3221922345-tozqEDtteuXBHHB43DXDSqDVX881DLXcbry7uP6",
            "accessTokenSecret": "6cYuZuZ8KyDSaCbirw6Mi7okjwDNFE28CiWor1lml6s6K",

            "callBackUrl": "None"
        };

        var twitter = new Twitter(config);

        twitter.getSearch({ 'q': '@realDonaldTrump','count': 100}, error, success);
        
    } else {
        fs.readFile('./index.html', function (err, file) {
            if (err) {
                // write an error response or nothing here  
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(file, "utf-8");
        });
    }
   


   
}).listen(port);