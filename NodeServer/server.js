var http = require('http');
//Get enviroment port, else use 1337
var port = process.env.port || 1337;
var fs = require('fs');
var url = require('url');

//Create server
http.createServer(function (req, res) {
  //Allow control to stop getting access control origin errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
//Get path of webpage the requesting webpage asked for
    var path = url.parse(req.url).pathname;
    if (path == "/gettweets") { //If its gettweets, receive tweets
        res.writeHead(200, { "Content-Type": "text/JSON" });
        //Callback functions
        var error = function (err, res, body) {
            console.log('ERROR [%s]', err.message);
        };
        var success = function (data) {

            res.end(data); //Send data as response
        };

        var Twitter = require('twitter-node-client').Twitter; //Create handle for twitter api
        //Set twitter connection config
        var config = {
            "consumerKey": "gwh4Oc5Tnwnx8Iwdq9aP1ltAJ",

            "consumerSecret": "jIzA3dAFVPLq3qeMzdJEQY9XvSJdx1FiQfwk0H97zewMwDyCYt",

            "accessToken": "3221922345-tozqEDtteuXBHHB43DXDSqDVX881DLXcbry7uP6",
            "accessTokenSecret": "6cYuZuZ8KyDSaCbirw6Mi7okjwDNFE28CiWor1lml6s6K",

            "callBackUrl": "None"
        };

        var twitter = new Twitter(config);
        //Search for tweets
        twitter.getSearch({ 'q': '@realDonaldTrump','count': 50}, error, success);

    } else { //If file doesnt end in gettweets send error response
        fs.readFile('./index.html', function (err, file) {
            if (err) {
                // write an error response or nothing here
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(file, "utf-8");
        });
    }




}).listen(port); //Open port for listening
console.log("Server started!"); //Log to console that server has started
