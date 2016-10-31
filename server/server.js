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
    if(request.url == "/biddings") {
        response.end(JSON.stringify(products));
    } else {
        var surl = request.url.split("/");
	//magic number...
        if(surl[1] == "biddings" && surl.length == 3) {
            var id = parseInt(surl[2]) - 1;
            if(products.hasOwnProperty(id)) {
                response.end(JSON.stringify(products[id]));
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
	var biddingPrice = parseInt(data);
	var surl = request.url.split("/");
	var id = parseInt(surl[2]) - 1;

	if(surl[1] == "bidding" && surl.length == 3 && !isNaN(biddingPrice)) {
		products[id].Price = biddingPrice;
	} else {
		response.end("400 bad request");
	}
	console.log(products[id]);
        console.log('BiddingPrice = '+data);
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
    'OPTIONS': handler_options,
};

var server = http.createServer(function (request, response){
    console.log(request['method']+' '+request.url);
    dispatch[request['method']](request, response);
});
server.listen(PORT, function(){
    console.log("Listening to http://localhost:%s", PORT);
});
