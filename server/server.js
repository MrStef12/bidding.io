#!/usr/bin/env node

// http://blog.modulus.io/build-your-first-http-server-in-nodejs

var content = require('./content');
var products = content.getProducts;
var http   = require('http');
const PORT = 9998;

send_header = function (response) {
    response.writeHead(200, {'Content-Type': 'application/json',
                             'Access-Control-Allow-Origin': '*',
                             'Access-Control-Allow-Methods': 'GET,PUT,POST'});
}

// handlers
handler_get = function (request, response) {
    send_header(response);
    if(request.url == "/adressbook") {
        response.end(JSON.stringify(adressbook));
    } else {
        var surl = request.url.split("/");
        if(surl[1] == "adressbook" && surl.length == 3) {
            var id = parseInt(surl[2]);
            if(adressbook.hasOwnProperty(id)) {
                response.end(JSON.stringify(adressbook[id]));
            } else {
                response.end("{}");
            }
        } else {
            response.end("{}");
        }
    }
};
handler_put = function (request, response) {
    request.on('data', function(data) {
        console.log(''+data);
        send_header(response);
        response.end(JSON.stringify(3));
    });
};
handler_post = function (request, response) {
    request.on('data', function(data) {
        console.log(''+data);
        send_header(response);
        response.end(JSON.stringify(3));
    });
};
handler_options = function (request, response) {
    send_header(response);
    response.end(null);
};

dispatch = {
    'GET':     handler_get,
    'PUT':     handler_put,
    'POST':    handler_post,
    'DELETE':  handler_delete,
    'OPTIONS': handler_options,
};

var server = http.createServer(function (request, response){
    console.log(request['method']+' '+request.url);
    dispatch[request['method']](request, response);
});
server.listen(PORT, function(){
    console.log("Listening to http://localhost:%s", PORT);
});
