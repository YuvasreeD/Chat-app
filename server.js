const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
 });

//Whenever someone connects this gets executed
io.on('connection', function(socket) {

    console.log('A user connected');

    const users = {}

    socket.on('user-name',function(name){
        users[socket.id] = name
        socket.broadcast.emit('user-joined',name)

    })

    socket.on('send-chat-message',function(message){
        io.emit('chat-message',{message:message , name : users[socket.id]})
    })
 
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        socket.broadcast.emit('user-disconnected',users[socket.id])
        delete users[socket.id]
       console.log('A user disconnected');
    });
 });

 http.listen(3000, function() {
    console.log("Successfully connected to port 3000");
 });