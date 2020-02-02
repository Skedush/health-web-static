import * as validater from '../validater';

describe('phone validater', () => {
  it('return true', () => {
    const phone = '13680802390';
    expect(validater.validationPhone(phone)).toEqual(true);
  });

  it('return false less than 11', () => {
    const phone = '13680802';
    expect(validater.validationPhone(phone)).toEqual(false);
  });

  it('return false more than 11', () => {
    const phone = '1368080239023';
    expect(validater.validationPhone(phone)).toEqual(false);
  });
});

describe('idCard validater', () => {
  it('return true', () => {
    const id = validater.makeID();
    expect(validater.validationIdCard(id)).toEqual(true);
  });

  it('return false', () => {
    const id = '330304199011173012';
    expect(validater.validationIdCard(id)).toEqual(false);
  });
});
