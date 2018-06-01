let express = require('express');
let app = express();
let server = require('http').createServer(app);
let socketIO = require('socket.io').listen(server);

let path = require('path');
let open = require('open');

function getResolvePath(pathString) {
    return path.resolve(pathString);
}

server.listen(5678, function () {
    let address = `http://localhost:${server.address().port}/`;
    console.log("启动成功！！！");
    console.log('访问地址为 %s', address);
    open(address);
});

app.use(express.static(getResolvePath('client')));

app.get('/', function (req, res) {
    res.sendFile(getResolvePath('client/index.html'));
});

socketIO.sockets.on('connection', function (socket) {

    //默认向浏览器推送一条问候消息
    socket.emit('renderNewMsgFromServer', {msg: 'hi，boy!'});

    //接收客户端推送到服务器的新消息
    socket.on('pushNewMsgToServer', function (data) {

        //通知浏览器渲染新的消息
        socket.emit('renderNewMsgFromServer', {msg: data.msg});
        //听说下面这句能聊天，先贴代码，改天试一把
        //socket.broadcast.emit('renderNewMsgFromServer', {msg: data.msg});

    });

});
