# FE_debugTool
前端远程调试平台，让调试移动端页面更加简单。
### 主要功能：
*  自动收集移动端的错误，并显示到控制台，调试移动端页面更加方便。
*  可以在PC控制台发送可执行代码到移动端的页面上，你将会体验到跟调试桌面端网页一样的快感。

### 使用及要求
1. PC需要node.js环境
2. 本工具使用了WebSocket技术，移动端需要android4.4+，iOS7+
3. 在要调试的移动端页面添加以下代码：
``` javascript
<script type="text/javascript" src="FeDebugTool.js"></script>
<script type="text/javascript">
//设置服务器ip
var ip = 'your server ip';
var port = 'your server port';
FeDebugTool.init(ip, port);
</script>
```
4. 使用`node index.js`启动服务器进行监听。
