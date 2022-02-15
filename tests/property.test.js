const expect = require("chai").expect;
const Porperty = require("../models/property");

describe("Porperty", () => {
  it("Should be invalid if property is empty", (done) => {
    let property = new Porperty({});
    property.validate((err) => {
      expect(err.errors).to.exist;
      done();
    });
  });
});
