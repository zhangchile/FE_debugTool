var exec = require("child_process").exec;
var querystring = require('querystring');
var fs = require("fs");

function sleep(ms) {
	var startTime = new Date().getTime();
	while(new Date().getTime() < startTime + ms);
}

function start(response, postData) {
	console.log("Request handler 'start' was called.");
	var content = "empty";

	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/upload" method="POST">'+
		'<textarea name="text" rows="20" cols="60"></textarea>'+
		'<input type="text" name="name" value=""/>'+
		'<input type="submit" value="Submit text" />'+
		'</form>'+
		'</body>'+
		'</html>';
	var filepath = "./console.html";
	var body = fs.readFileSync(filepath, "utf-8");

		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(body);
		response.end();


	// exec("find /", {timeout: 10000, maxBuffer:20000*1024}, function(error, stdout, stderr) {
	// 	// sleep(10000);
	// 	response.writeHead(200, {"Content-Type": "text/plain"});
	// 	response.write(stdout);
	// 	response.end();
	// });

}

function upload(response, postData) {
	console.log("Request handler 'upload' was called");
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("You've have sent: " + querystring.parse(postData).name);
		response.end();
	// return "Hello Upload";
}



exports.start = start;
exports.upload = upload;