var url = "http://localhost:9998";

get = function (url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
};

put = function (url, data, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                callback(xmlHttp.responseText);
            } else {
                alert("Could not place bet: " + xmlHttp.statusText);
            }
        }
    }
    xmlHttp.open("PUT", url, true); // true for asynchronous 
    xmlHttp.send(data);
};

var activeBidID;

do_get = function (id) {
    var thisurl = url + "/bidding/" + id;
    get(thisurl, function (content) {
        document.getElementById("auctionDetails").style.display = "block";
        document.getElementById("auctionNotYet").style.display = "none";
        var title = document.getElementById("auctionTitle");
        var desc = document.getElementById("auctionDesc");
        var created = document.getElementById("auctionCreateDate");
        var end = document.getElementById("auctionEndDate");
        var quantity = document.getElementById("auctionQuantity");
        var price = document.getElementById("auctionPrice");

        var bid = JSON.parse(content);
        activeBidID = parseInt(bid.ID);
        title.innerText = bid.Name;
        desc.innerText = bid.Description;
        created.innerText = bid.CreatedDate;
        end.innerText = bid.EndDate;
        quantity.innerText = bid.Quantity;
        price.innerText = bid.Price;
    });
};
do_get_all = function () {
    var thisurl = url + "/biddings";
    get(thisurl, function (content) {
        var htmllist = document.getElementById("auctionList");
        htmllist.innerHTML = ""; //Clear the list
        var biddings = JSON.parse(content);
        var html = "";
        for (var i in biddings) {
            var date = new Date(biddings[i].EndDate);
            html += "<tr>";
            html += "<th scope='row'>" + biddings[i].ID + "</td>";
            html += "<td>" + biddings[i].Name + "</td>";
            html += "<td>" + biddings[i].Price + "</td>";
            html += "<td>" + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + "</td>";
            html += "<td><button type='button' class='btn btn-primary' onclick='do_get(" + biddings[i].ID + ")'>See more</button></td>";
            html += "</tr>";
        }
        htmllist.innerHTML += html;
    });
};

do_put = function () {
    if (activeBidID != undefined) {
        var thisurl = url + "/bidding/" + activeBidID;
        var userBidField = document.getElementById('userBid');
        var userBid = parseInt(userBidField.value);
        if (!isNaN(userBid)) {
            put(thisurl, userBid, function (content) {

            });
        } else {
            alert("Could not place bet. Please input a valid number.");
        }
    }
};
window.setInterval(function () {
    do_get_all();
    if (activeBidID != undefined) {
        do_get(activeBidID);
    }
}, 1000);
window.onload = function () {
    console.log("Welcome to bidding.io! Loading content...");
    do_get_all();
}