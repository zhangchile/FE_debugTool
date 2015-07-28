var FeDebugTool = {
	host : 'null',
	port : 8888,
	url  : 'null',
	ws   : 'null',

	init: function(host, port) {
		this.host = host;
		this.port = port;
		this.url  = 'ws://'+host+':'+port+'/'; 
		this.ws = new WebSocket(this.url, 'echo-protocol');  //建于服务器之间的连接通信

		var that = this;
		//错误处理
		window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, error) {

			if ((that.ws).readyState === that.ws.OPEN) {
				//执行时的错误
			    that.reportError({
			    	message: errorMessage,
			    	script: scriptURI,
			    	line: lineNumber,
			    	column: columnNumber
			    });
			} else {
				//在页面加载时的错误
				var str = that.createErrStr({
			    	message: errorMessage,
			    	script: scriptURI,
			    	line: lineNumber,
			    	column: columnNumber
			    });
				var interws = new WebSocket(that.url, 'echo-protocol');
				interws.onopen = function() {
			    	interws.send("error#" + str);
			    	interws.close();
				}
				interws.onmessage = function(msg) {
					// console.log(msg.data)
			    	// interws.close();
				}
				interws.onclose = function() {

				}
			}
			return true;
		}


		this.ws.onopen = function() {//通过onopen事件句柄来监听socket的打开事件
			console.log('连接成功');
		  	//发送客户端的信息
		    var clientinfo = window.navigator.appName +","+ window.navigator.appVersion +","+ window.navigator.platform;
		    // console.log(clientinfo)
		    that.ws.send("client#" + clientinfo);
		}  
		this.ws.onmessage = function(e) {//用onmessage事件句柄接受服务器传过来的数据
		 
		   var msg = e.data; 
		   console.log("from server: "+ e.data)
		   var chatBox = document.getElementById('chat-box');     
		   chatBox.innerHTML = chatBox.innerHTML+msg+'<br/>';
		    if (msg.indexOf("command#") >= 0) {
		   		var command = msg.substr(msg.indexOf("#") + 1);
		   		//创建script标签
		   		var script = document.createElement('script'); 
		   		script.type = 'text/javascript';
		   		script.innerHTML = command;
		   		document.body.appendChild(script); 
		    }
		}

		this.ws.onclose = function() {
			//断线重连
			console.log('连接已断开，3秒后尝试重连...');
			setTimeout(function() { that.reconect(that.host, that.port)}, 3000);
		}

		this.ws.onerror = function() {
			//错误
			console.log('连接失败，无法连接服务器，请检查服务器配置是否正确');
		}
		    
		function send() { //使用send方法向服务器发送数据
		
		// var talk = $('talk');  
		// var nike = $('nike');   
		// w.send('<strong style="color:red">'+nike.value+':</strong>'+talk.value);  
		}  

	},

	createErrStr: function (error) {
		return "错误信息：" + error.message + "，文件：" + error.script + " 第" + error.line +"行，" + error.column + "列";
	},

	reportError: function (error) {
		// console.log(this.ws.readyState)

		var errorStr = this.createErrStr(error);

		// console.log(errorStr);

		this.ws.send("error#" + errorStr); 

	},

	recordError: function (error) {
		if(window.error_log == undefined) {
			window.error_log = [];
		}
		var errorStr = this.createErrStr(error);
		// console.log(errorStr);
		window.error_log.push(errorStr);
		// console.log(error_log)
	},

	sleep: function (milliSeconds) {
		var startTime = new Date().getTime();
		while (new Date().getTime() < startTime + milliSeconds);
	},

	sendRecord: function () {
		// alert('df')
		for (var i = 0; i < window.error_log.length - 1; i++) {

			var errorStr = createErrStr(error);
			this.ws.send("error#" + errorStr); 
			console(errorStr);
		};
	},
	debugDump: function(value) {
		this.ws.send("debug#>" + value.toString());
	},

	reconect : function (host, port) {
		this.init(host,port);
	}

}

