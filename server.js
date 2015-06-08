var clients = Array();

var webSocketsServerPort = 8888;
var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var WebSocketFrame  = require('websocket').frame;
var WebSocketRouter = require('websocket').router;
var W3CWebSocket = require('websocket').w3cwebsocket;
var http = require('http');

var server = http.createServer(function(request, response) {

});
server.listen(webSocketsServerPort, function() {
    console.log(getNow() + " WebSocket Server is listening on port：" + webSocketsServerPort);
});

var wsServer = new WebSocketServer({httpServer: server});

wsServer.on('request', function(request) {
    console.log(getNow() + ' ' + request.origin + ' 请求连接.');

    var connection = request.accept(null, request.origin); 
    var index = clients.push(connection) - 1;
    console.log(getNow() + ' 已建立连接...');

     connection.on('message', function(message) {
        if(message.type === 'utf8') {
             console.log(getNow() + ': ' + message.utf8Data);
        }
     });

    connection.on('close', function(connection) {
            console.log(getNow() + " -- " + connection.remoteAddress + " 断开链接.");
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