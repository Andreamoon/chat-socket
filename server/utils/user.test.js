const expect = require('expect');

const {
  Users
} = require('./user');

describe('Users', () => {
  var users;
  beforeEach(() => {
    users = new Users();

    users.usersArray = [{
        id: '1',
        name: 'Mike',
        room: 'Node Course'
      },
      {
        id: '2',
        name: 'Gordon',
        room: 'Java Course'
      }, {
        id: '3',
        name: 'Ron',
        room: 'Node Course'
      }
    ]

  });
  it('Dovrebbe aggiungere un Utente', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'ANdrea',
      room: 'Office'
    };
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.usersArray).toEqual([user]);

  });

  //controllo il metodo remove user
  it('Dovrebbe rimuovere un utente', () => {
    var userId = '1';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.usersArray.length).toBe(2);
  });

  //se l id non è corretto non deve rimuove l utente
  it('Non dovrebbe rimuovere un utente', () => {
    var userId = '99';
    var user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.usersArray.length).toBe(3);
  });

  //Dovrebbe trovare l' utente tramite l 'id
  it('Dovrebbe trovare un utente', () => {
    var userId = '2';
    var user = users.getUser(userId);
    expect(user.id).toEqual(userId);
  });
  //se l id non è corretto non deve trovare l utente
  it('Non dovrebbe trovare un utente', () => {
    var userId = '99';
    var user = users.getUser(userId);

    expect(user).toNotExist();
  });


  it('dovrebbe tornare tutti gli utenti del corso Node', () => {
    var userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Mike', 'Ron']);
  });
  it('dovrebbe tornare tutti gli utenti del corso Java', () => {
    var userList = users.getUserList('Java Course');
    expect(userList).toEqual(['Gordon']);
  });
});