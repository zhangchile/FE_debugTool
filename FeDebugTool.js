var FeDebugTool = {
	host : 'null',
	port : 8888,
	url  : 'null',
	ws   : 'null',

	init: function(host, port) {
		this.host = host;
		this.port = port;
		this.url  = 'ws://'+host+':'+port+'/'; 
		this.ws = new WebSocket(this.url,'echo-protocol');  //建于服务器之间的连接通信

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
				    	interws.send(str);
					}
					interws.onmessage = function(msg) {
						// console.log(msg.data)
				    	interws.close();
					}
					interws.onclose = function() {

					}
				}
			return true;
		}


		this.ws.onopen = function()//通过onopen事件句柄来监听socket的打开事件
		{  
			// $('chat-box').innerHTML = '已连接到服务器......<br/>';
		 	// function sendNumber() {
		  //       if (w.readyState === w.OPEN) {
		  //           var number = Math.round(Math.random() * 0xFFFFFF);
		  //           w.send(number.toString());
		  //           setTimeout(sendNumber, 3000);
		  //       }
		  //   }
		    // sendNumber();
		}  
		this.ws.onmessage = function(e)//用onmessage事件句柄接受服务器传过来的数据
		{  
		   var msg = e.data; 
		   console.log("from server: "+ e.data)
		   var chatBox = $('chat-box');  
		  // audioElement.play();      
		   chatBox.innerHTML = chatBox.innerHTML+msg+'<br/>';  
		}  
		    
		function send()//使用send方法向服务器发送数据
		{  
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

			this.ws.send(errorStr); 

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
				ws.send(errorStr); 
				console(errorStr)
			};
		}	
}