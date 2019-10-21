const expect = require('chai').expect;
const {plusMinus} = require('../helper');

describe('Test plusMinus function', () => {
  describe('plusMinus', () => {
    it('should return 3 when {operator: +, leftValue: 1, rightValue: 2}', () => {
      result = plusMinus('+', 1, 2);
      expect(result).to.equal(3);
    });

    it('should return -1 when {operator: +, leftValue: 1, rightValue: -2}', () => {
      result = plusMinus('+', 1, -2);
      expect(result).to.equal(-1);
    });

    it('should return 1 when {operator: +, leftValue: -1, rightValue: 2}', () => {
      result = plusMinus('+', -1, 2);
      expect(result).to.equal(1);
    });

    it('should return -3 when {operator: +, leftValue: -1, rightValue: -2}', () => {
      result = plusMinus('+', -1, -2);
      expect(result).to.equal(-3);
    });

    it('should return -1 when {operator: -, leftValue: 1, rightValue: 2}', () => {
      result = plusMinus('-', 1, 2);
      expect(result).to.equal(-1);
    });

    it('should return 3 when {operator: -, leftValue: 1, rightValue: -2}', () => {
      result = plusMinus('-', 1, -2);
      expect(result).to.equal(3);
    });

    it('should return -3 when {operator: -, leftValue: -1, rightValue: 2}', () => {
      result = plusMinus('-', -1, 2);
      expect(result).to.equal(-3);
    });

    it('should return 1 when {operator: -, leftValue: -1, rightValue: -2}', () => {
      result = plusMinus('-', -1, -2);
      expect(result).to.equal(1);
    });
  });
});