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

    it('return 1_2/2 when input is 2', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    it('return 1_4/2 when input is 3', () => {
      return infixCalc.calculatePromise('1/2').then(result => {
        assert.equal(result, '1/2');
      });
    });

    //lower follower by higher-precedence
    it('return 7 when input is 1 + 2 * 3', () => {
      return infixCalc.calculatePromise('1 + 2 * 3').then(result => {
        assert.equal(result, '7');
      });
    });

    //higher follower by lower-precedence
    it('return 5 when input is 1 * 2 + 3', () => {
      return infixCalc.calculatePromise('1 * 2 + 3').then(result => {
        assert.equal(result, '5');
      });
    });

    //consecutive divisions
    it('return 1/6 when input is 1 / 2 / 3', () => {
      return infixCalc.calculatePromise('1 / 2 / 3').then(result => {
        assert.equal(result, '1/6');
      });
    });

    //consecutive divisions
    it('return 1/3 when input is 2 / 2 / 3', () => {
      return infixCalc.calculatePromise('2 / 2 / 3').then(result => {
        assert.equal(result, '1/3');
      });
    });

    //consecutive divisions
    it('return 1/2 when input is 3 / 2 / 3', () => {
      return infixCalc.calculatePromise('3 / 2 / 3').then(result => {
        assert.equal(result, '1/2');
      });
    });

    //consecutive divisions
    it('return 1_1/3 when input is 8 / 2 / 3', () => {
      return infixCalc.calculatePromise('8 / 2 / 3').then(result => {
        assert.equal(result, '1_1/3');
      });
    });

    //consecutive divisions
    it('return 1/3 when input is 8 / 2 / 3 / 4', () => {
      return infixCalc.calculatePromise('8 / 2 / 3 / 4').then(result => {
        assert.equal(result, '1/3');
      });
    });

    //two multiplications surrounding one division
    it('return 7_1/2 when input is 2 * 3 / 4 * 5', () => {
      return infixCalc.calculatePromise('2 * 3 / 4 * 5').then(result => {
        assert.equal(result, '7_1/2');
      });
    });

    //two divisions surrounding one multiplication
    it('return 8/15 when input is 2 / 3 * 4 / 5', () => {
      return infixCalc.calculatePromise('2 / 3 * 4 / 5').then(result => {
        assert.equal(result, '8/15');
      });
    });

    //two divisions surrounding one multiplication
    it('return 1_1/15 when input is 4 / 3 * 4 / 5', () => {
      return infixCalc.calculatePromise('4 / 3 * 4 / 5').then(result => {
        assert.equal(result, '1_1/15');
      });
    });

    //two lower-precedences surround one higher
    it('return 11 when input is 1 + 2 * 3 + 4', () => {
      return infixCalc.calculatePromise('1 + 2 * 3 + 4').then(result => {
        assert.equal(result, '11');
      });
    });

    //two higher-precedences surround one lower
    it('return 14 when input is 1 * 2 + 3 * 4', () => {
      return infixCalc.calculatePromise('1 * 2 + 3 * 4').then(result => {
        assert.equal(result, '14');
      });
    });

    //two higher-precedences followed by one lower
    it('return 10 when input is 1 * 2 * 3 + 4', () => {
      return infixCalc.calculatePromise('1 * 2 * 3 + 4').then(result => {
        assert.equal(result, '10');
      });
    });

    //two lower-precedences followed by one higher
    it('return 15 when input is 1 + 2 + 3 * 4', () => {
      return infixCalc.calculatePromise('1 + 2 + 3 * 4').then(result => {
        assert.equal(result, '15');
      });
    });

    //two additions surround one division
    it('return 4 when input is 1 + 2 - 3 + 4', () => {
      return infixCalc.calculatePromise('1 + 2 - 3 + 4').then(result => {
        assert.equal(result, '4');
      });
    });

    //combine all operators lo-hi-lo
    it('return -2_1/4 when input is 2 + 3 / 4 - 5', () => {
      return infixCalc.calculatePromise('2 + 3 / 4 - 5').then(result => {
        assert.equal(result, '-2_1/4');
      });
    });

    //simple decimal number
    it('return 2.5 when input 2.5', () => {
      return infixCalc.calculatePromise('2.5').then(result => {
        assert.equal(result, '2.5');
      });
    });

    //simple negative number
    it('return -2 when input -2', () => {
      return infixCalc.calculatePromise('-2').then(result => {
        assert.equal(result, '-2');
      });
    });

    //simple negative decimal number
    it('return -2.5 when input -2.5', () => {
      return infixCalc.calculatePromise('-2.5').then(result => {
        assert.equal(result, '-2.5');
      });
    });

    //division of decimal numbers
    it('return 1/2 when input 2.0 / 4.0', () => {
      return infixCalc.calculatePromise('2.0 / 4.0').then(result => {
        assert.equal(result, '1/2');
      });
    });

    //division of decimal numbers of different polarity
    it('return -1/2 when input 2.0 / -4.0', () => {
      return infixCalc.calculatePromise('2.0 / -4.0').then(result => {
        assert.equal(result, '-1/2');
      });
    });

    //crazy long operation
    it('return -2_130.70000000000005/132 when input is 2 / 3 + 5 * 5 / 6 - 7 / 8 * 9 + 10 / 11 / 12 * 13 - 14 / 15', () => {
      return infixCalc.calculatePromise('2 / 3 + 5 * 5 / 6 - 7 / 8 * 9 + 10 / 11 / 12 * 13 - 14 / 15').then(result => {
        assert.equal(result, '-2_130.70000000000005/132');
      });
    });
  });
});