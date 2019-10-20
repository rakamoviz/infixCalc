var assert = require('assert');
var infixCalc = require('../index');

describe('Infix Calc', () => {
  describe('calculate', () => {
    it('should return 1_7/8 when input is 1/2 * 3_3/4', () => {
      return infixCalc.calculatePromise('1/2 * 3_3/4').then(result => {
        assert.equal(result, '1_7/8');
      });
    });

    it('should return 3_1/2 when input is 2_3/8 + 9/8', () => {
      return infixCalc.calculatePromise('2_3/8 + 9/8').then(result => {
        assert.equal(result, '3_1/2');
      });
    });

    it('should return the number when input is a simple number', () => {
      return infixCalc.calculatePromise('1').then(result => {
        assert.equal(result, '1');
      });
    });

    it('should return the fraction when input is a fraction', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('should return the mixed number when input is a mixed number', () => {
      return infixCalc.calculatePromise('3_1/2').then(result => {
        assert.equal(result, '3_1/2');
      });
    });

    it('return simple number when adding two simple numbers', () => {
      return infixCalc.calculatePromise('1 + 2').then(result => {
        assert.equal(result, '3');
      });
    });

    it('return simple number when substracting two simple numbers', () => {
      return infixCalc.calculatePromise('1 - 2').then(result => {
        assert.equal(result, '-1');
      });
    });

    it('return simple number when multiplying two simple numbers', () => {
      return infixCalc.calculatePromise('2 * 3').then(result => {
        assert.equal(result, '6');
      });
    });

    it('return 1/2 when input is 1/2', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 1/2 when input is 1 / 2', () => {
      return infixCalc.calculatePromise('1 / 2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 1/2 when input is 2/4', () => {
      return infixCalc.calculatePromise('2/4').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 1/2 when input is 2 / 4', () => {
      return infixCalc.calculatePromise('2 / 4').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 3 when input is 1_2/2', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 2_1/2 when input is 1_3/2', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 1_0/2 when input is 1', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 1_2/2" when input is 2', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 1_4/2" when input is 3', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });
  });
});