//当前连接的客户端
var clients = Array();
//控制台
var front_console = null;

var webSocketsServerPort = 8888;
var WebSocketServer = require('websocket').server;
// var WebSocketClient = require('websocket').client;
// var WebSocketFrame  = require('websocket').frame;
// var WebSocketRouter = require('websocket').router;
// var W3CWebSocket = require('websocket').w3cwebsocket;
var http = require('http');
var url = require('url');


function start(route, handle) {
    function onRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        request.setEncoding('utf8');

        request.addListener('data', function(postDataChunk) {
            postData += postDataChunk;  
            // console.log("Received POST data chunk '" + postDataChunk + "'.")
        });

        request.addListener("end", function() {
            route(handle, pathname, response, postData);
        });
    }


var server = http.createServer(onRequest);
server.listen(webSocketsServerPort, function() {
    console.log(getNow() + " WebSocket Server is listening on port：" + webSocketsServerPort);
});

var wsServer = new WebSocketServer({httpServer: server});

wsServer.on('request', function(request) {
    // console.log(getNow() + ' -- ' + request.origin + ' 请求连接.');

    var connection = request.accept('echo-protocol', request.origin); 
    var index = clients.push(connection) - 1;
    console.log(getNow() + " " + request.origin + ' 已建立连接...');

     connection.on('message', function(message) {
        if(message.type === 'utf8') {
            // console.log(getNow() + ': ' + message.utf8Data);

            //信息过滤与分派
            var msg = message.utf8Data;

            if (msg == "console") {
                console.log(getNow() + " 控制台已连接。")
                front_console = connection;
                connection.sendUTF("控制台已连接。");
                clients.pop();
                index = index - 1;
            } else if (msg.substr(0, 8) == "command#") {
                //来自控制台的命令
                var command = msg.substr(msg.indexOf("#") + 1);
                console.log(command);
                front_console.sendUTF("执行命令：" + command);

                for (var i = clients.length - 1; i >= 0; i--) {
                    clients[i].sendUTF(msg);
                };
            } else if (msg.substr(0, 6) == "error#") {
                var error = msg.substr(msg.indexOf("#") + 1);
                if (front_console) {
                    front_console.sendUTF("<span class='error'>" + error + "</span>");
                }
                //如果控制台没连接
            } else if (msg.substr(0, 6) == "debug#") {
                var debug = msg.substr(msg.indexOf("#") + 1);
                if (front_console) {
                    front_console.sendUTF(debug);
                }
            } else if (msg.substr(0, 7) == "client#"){
                //客户端连接 发送客户端的信息
                var client = msg.substr(msg.indexOf("#") + 1);
                var appName = client.split(",")[0];
                var appVersion = client.split(",")[1];
                var platform = client.split(",")[2];
                if (front_console) {
                    front_console.sendUTF("客户端："+platform + " 已建立连接");
                }
            } else {
                //
                front_console.sendUTF(message.utf8Data);
            }

        }
     });

    connection.on('close', function(connection) {
            console.log(getNow() + " -- " + connection.remoteAddress + " 断开链接.");
            clients.pop();
            index = index - 1;
            console.log(getNow() + " 当前连接数：" + clients.length);
            if (front_console) {
                front_console.sendUTF(getNow() + " -- " + connection.remoteAddress + " 断开链接。当前连接数："+ clients.length);
            }
        });
    });


function getNow() {
    return new Date().format('yyyy-MM-dd hh:mm:ss');
}

Date.prototype.format = function (fmt) { //author: meizz   
     var o = {
         "M+": this.getMonth() + 1,
         "d+": this.getDate(),   
         "h+": this.getHours(),   
         "m+": this.getMinutes(),  
         "s+": this.getSeconds(),   
         "q+": Math.floor((this.getMonth() + 3) / 3),   
         "S": this.getMilliseconds()   
     };
     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
     for (var k in o)
     if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
     return fmt;
 }

}

exports.start = start;