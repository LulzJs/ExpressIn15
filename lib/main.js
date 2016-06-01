'use strict'
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('rethinkdb');
var connection = null;

app.use(express.static('assets'));

r.connect( {host: 'localhost', port: 28015}).then((result) => {
  connection = result;

  r.db('test').tableCreate('chat').run(connection, () => {});

  r.table('chat').changes().run(connection).then((cursor) => {
      cursor.each((err, row) => {
          io.emit('chat message', row.new_val);
      });
  });

});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(res){
    r.table('chat').insert({
      text: res.text,
      datetime: res.datetime,
      img_url: res.avatar_url
    }).run(connection);
  });
});

http.listen(3000);
