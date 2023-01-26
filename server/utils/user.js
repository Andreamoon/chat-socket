// In questo file creo una classe Person e una classe user per generare oggetti che mi serviranno sulla chat
/*
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getUsersDescription() {
    return `${this.name} ha ${this.age} anni`;
  }
}
*/

class Users {
  constructor() {
    this.usersArray = [];
  }
  addUser(id, name, room) {
    var user = {
      id,
      name,
      room
    };
    this.usersArray.push(user);
    return user;

  }

  removeUser(id) {
    //rimuove un utente 
    var user = this.getUser(id);

    if (user) {
      this.usersArray = this.usersArray.filter((user) => user.id !== id);
    }
    return user;
  }
  getUser(id) {
    //legge un utente
    return this.usersArray.filter((user) => user.id === id)[0];

  }
  getUserList(room) {
    //ritorno gli utenti di una room
    var users = this.usersArray.filter((user) => user.room === room);
    //prendo i nomi degli utenti
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = {
  Users
};