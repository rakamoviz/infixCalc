const expect = require('chai').expect;
const {toMixedNumber} = require('../helper');

describe('Test toMixedNumber function', () => {
  describe('toMixedNumber', () => {
    it('should return [-5, 3] when input -1_2/3', () => {
      result = toMixedNumber('-1_2/3');

      expect(result[0]).to.equal(-5);
      expect(result[1]).to.equal(3);
    });
  });
});