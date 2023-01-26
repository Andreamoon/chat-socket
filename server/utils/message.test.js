var expect = require('expect');

var {
  generateMessage,
  generateLocationMessage
} = require('./message');

describe('generateMessage', () => {
  it('dovrebbe generare il messagio corretto', () => {

    //la risposta in una variabile
    //affermare che il from sia corretto
    //affermare che il text sia corretto
    //affermare che la data sia tipo numero
    var from = 'jen';
    var text = 'un messaggio';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({
      from,
      text
    });

  });
});

describe('generateLocationMessage', () => {
  it('la location dovrebbe essere corretta', () => {
    var from = 'Den';
    var latitude = 15;
    var longitude = 19;
    var url = 'https://www.google.com/maps?q=15,19';
    var message = generateLocationMessage(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({
      from,
      url
    });
  });
});