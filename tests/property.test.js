const { expect } = require('chai');
const Porperty = require('../models/property');

describe('Porperty', () => {
  it('Should be invalid if property is empty', (done) => {
    const property = new Porperty({});
    property.validate((err) => {
      expect(err.errors).to.exist;
      done();
    });
  });
});
