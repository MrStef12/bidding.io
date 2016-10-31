var url = "http://localhost:9998/";

get = function(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
};

put = function(url, data, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("PUT", url, true); // true for asynchronous 
    xmlHttp.send(data);
};

do_get = function (id) {
    var thisurl = url+"/biddings/"+id;
    get(thisurl, function (content) {
        // TODO once returned
    });
};
do_get_all = function () {
    var thisurl = url+"/biddings";
    get(thisurl, function (content) {
        var htmllist = document.getElementById("auctionList");
        htmllist.innerHTML = ""; //Clear the list
        console.log(content);
        var biddings = JSON.parse(content);
    });
};

do_put = function () {
    var textarea = document.getElementById('data');
    put(url, textarea.value, function (content) {
        // Put action!
    });
};

window.onload = function() {
    console.log("Welcome to bidding.io! Loading content...");
    do_get_all();
}