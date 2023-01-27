"use strict";

const path = require("path");
const http = require("http");
const express = require("express");

//setto il servizio soket.io
const socketIO = require("socket.io");
//importo il file che mi genera il messagio
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/message");
const {
  isRealString
} = require("./utils/validation.js");

//chiamo la classe Users
const {
  Users
} = require("./utils/user");

//imposto il percorso relativo con il moduloo path
const publicPath = path.join(__dirname, "../public");
const app = express();
// istanzion http e gli passo express
const server = http.createServer(app);

//adesso passo server sul servizio socket.io
const io = socketIO(server);
var users = new Users();

//apro la connessione con il client
io.on("connection", socket => {
  console.log("nuovo utente connesso");
  socket.on("join", (params, callback) => {
    if (!isRealString(params.name || !isRealString(params.room))) {
      return callback("Nome proprio e room name sono richiesti");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    //sul JOIN creo la possibilità di unire le personoe nella stessa room in privato
    //socket.emit messagio dall Admin benvenuto nrlla chatt
    socket.emit("newMessage", generateMessage("Admin", "Benvenuto nella  chat"));

    //socket.broadcast.emit dall' Admin verso il nuovo utente connesso eccetto quelli gia connessi
    socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} : "si è unito alla chat"`));
    callback();
  });
  //registro evento (event listener dal client) createMessage
  socket.on("createMessage", (message, callback) => {
    var user = users.getUser(socket.id);
    console.log(user);
    if (user && isRealString(message.text)) {
      console.log(user);
      io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
    }
    //io.emit gestisce ogni singola connessione utente-utente
    //io.emit('newMessage', generateMessage(message.from, message.text));
    callback("questo messaggio arriva dal server");
  });

  //event linstener location dal client
  socket.on("createLocationMessage", coords => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

    //io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  //registro l'evento disconnnession
  socket.on("disconnect", () => {
    console.log("Utente disconnesso");
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name}: ha lasciato la chat`));
    }
  });
});

//Imposto l'envirometns process
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
server.listen(port, () => {
  console.log(`Server  listen on port ${port}`);
});

/*
IF LISTEN EADRINUUSE ====>  C:\Windows\System32>taskkill /F /IM node.exe
*/