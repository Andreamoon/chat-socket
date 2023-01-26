const expect = require('expect');

var {
  isRealString
} = require('./validation');

describe('validation', () => {
  it('Dovrebbe essere tipo String', () => {
    var res = isRealString(1)

    expect(res).toBe(false);
  });
  it('Se digiti solo spazi non va bene', () => {
    var res = isRealString('  ');
    expect(res).toBe(false);
  });

  it('Dovrebbe permettere stringhe con spazi', () => {
    var res = isRealString('   Andrea   ')

    expect(res).toBe(true);
  });
});