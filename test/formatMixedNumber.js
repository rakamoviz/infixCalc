const expect = require('chai').expect;
const {toMixedNumber, formatMixedNumber} = require('../helper');

describe('Test formatMixedNumber function', () => {
  describe('formatMixedNumber', () => {
    it('should return -1_2/3 when {dividend: -5, divisor: 3}', () => {
      result = formatMixedNumber(-5, 3);
      expect(result).to.equal('-1_2/3');
    });

    it('should return -1_2/3 when operand -1_2/3', () => {
      result = formatMixedNumber(...toMixedNumber('-1_2/3'));
      expect(result).to.equal('-1_2/3');
    });
  });
});