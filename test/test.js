const expect = require('chai').expect;
const {calculatePromise} = require('../index');

describe('Infix Calc', async () => {
  describe('calculate', () => {
    it('should return 1_7/8 when input is 1/2 * 3_3/4', async () => {
      const result = await calculatePromise('1/2 * 3_3/4');
      expect(result).to.equal('1_7/8');
    });

    it('should return 3_1/2 when input is 2_3/8 + 9/8', async () => {
      const result = await calculatePromise('2_3/8 + 9/8');
      expect(result).to.equal('3_1/2');
    });

    it('should return the number when input is a simple number', async () => {
      const result = await calculatePromise('1');
      expect(result).to.equal('1');
    });

    it('should return the fraction when input is a fraction', async () => {
      const result = await calculatePromise('1/2');
      expect(result).to.equal('1/2');
    });

    it('should return the mixed number when input is a mixed number', async () => {
      const result = await calculatePromise('3_1/2');
      expect(result).to.equal('3_1/2');
    });

    it('return simple number when adding two simple numbers', async () => {
      const result = await calculatePromise('1 + 2');
      expect(result).to.equal('3');
    });

    it('return simple number when substracting two simple numbers', async () => {
      const result = await calculatePromise('1 - 2');
      expect(result).to.equal('-1');
    });

    it('return simple number when multiplying two simple numbers', async () => {
      const result = await calculatePromise('2 * 3');
      expect(result).to.equal('6');
    });

    it('return 1/2 when input is 1/2', async () => {
      const result = await calculatePromise('1/2');
      expect(result).to.equal('1/2');
    });

    it('return 1/2 when input is 1 / 2', async () => {
      const result = await calculatePromise('1 / 2');
      expect(result).to.equal('1/2');
    });

    it('return 1/2 when input is 2/4', async () => {
      const result = await calculatePromise('2/4');
      expect(result).to.equal('1/2');
    });

    it('return 1/2 when input is 2 / 4', async () => {
      const result = await calculatePromise('2 / 4');
      expect(result).to.equal('1/2');
    });

    it('return 3 when input is 1_2/2', async () => {
      const result = await calculatePromise('1/2');
      expect(result).to.equal('1/2');
    });

    it('return 2_1/2 when input is 1_3/2', async () => {
      const result = await calculatePromise('1/2');
      expect(result).to.equal('1/2');
    });

    it('return 1_0/2 when input is 1', async () => {
      const result = await calculatePromise('1/2');
      expect(result).to.equal('1/2');
    });

    it('return 1_2/2 when input is 2', async () => {
      const result = await calculatePromise('1/2');
      expect(result).to.equal('1/2');
    });

    it('return 1_4/2 when input is 3', async () => {
      const result = await calculatePromise('1/2');
      expect(result).to.equal('1/2');
    });

    //lower follower by higher-precedence
    it('return 7 when input is 1 + 2 * 3', async () => {
      const result = await calculatePromise('1 + 2 * 3');
      expect(result).to.equal('7');
    });

    //higher follower by lower-precedence
    it('return 5 when input is 1 * 2 + 3', async () => {
      const result = await calculatePromise('1 * 2 + 3');
      expect(result).to.equal('5');
    });

    //consecutive divisions
    it('return 1/6 when input is 1 / 2 / 3', async () => {
      const result = await calculatePromise('1 / 2 / 3');
      expect(result).to.equal('1/6');
    });

    //consecutive divisions
    it('return 1/3 when input is 2 / 2 / 3', async () => {
      const result = await calculatePromise('2 / 2 / 3');
      expect(result).to.equal('1/3');
    });

    //consecutive divisions
    it('return 1/2 when input is 3 / 2 / 3', async () => {
      const result = await calculatePromise('3 / 2 / 3');
      expect(result).to.equal('1/2');
    });

    //consecutive divisions
    it('return 1_1/3 when input is 8 / 2 / 3', async () => {
      const result = await calculatePromise('8 / 2 / 3');
      expect(result).to.equal('1_1/3');
    });

    //consecutive divisions
    it('return 1/3 when input is 8 / 2 / 3 / 4', async () => {
      const result = await calculatePromise('8 / 2 / 3 / 4');
      expect(result).to.equal('1/3');
    });

    //two multiplications surrounding one division
    it('return 7_1/2 when input is 2 * 3 / 4 * 5', async () => {
      const result = await calculatePromise('2 * 3 / 4 * 5');
      expect(result).to.equal('7_1/2');
    });

    //two divisions surrounding one multiplication
    it('return 8/15 when input is 2 / 3 * 4 / 5', async () => {
      const result = await calculatePromise('2 / 3 * 4 / 5');
      expect(result).to.equal('8/15');
    });

    //two divisions surrounding one multiplication
    it('return 1_1/15 when input is 4 / 3 * 4 / 5', async () => {
      const result = await calculatePromise('4 / 3 * 4 / 5');
      expect(result).to.equal('1_1/15');
    });

    //two lower-precedences surround one higher
    it('return 11 when input is 1 + 2 * 3 + 4', async () => {
      const result = await calculatePromise('1 + 2 * 3 + 4');
      expect(result).to.equal('11');
    });

    //two higher-precedences surround one lower
    it('return 14 when input is 1 * 2 + 3 * 4', async () => {
      const result = await calculatePromise('1 * 2 + 3 * 4');
      expect(result).to.equal('14');
    });

    //two higher-precedences followed by one lower
    it('return 10 when input is 1 * 2 * 3 + 4', async () => {
      const result = await calculatePromise('1 * 2 * 3 + 4');
      expect(result).to.equal('10');
    });

    //two lower-precedences followed by one higher
    it('return 15 when input is 1 + 2 + 3 * 4', async () => {
      const result = await calculatePromise('1 + 2 + 3 * 4');
      expect(result).to.equal('15');
    });

    //two additions surround one division
    it('return 4 when input is 1 + 2 - 3 + 4', async () => {
      const result = await calculatePromise('1 + 2 - 3 + 4');
      expect(result).to.equal('4');
    });

    //combine all operators lo-hi-lo
    it('return -2_1/4 when input is 2 + 3 / 4 - 5', async () => {
      const result = await calculatePromise('2 + 3 / 4 - 5');
      expect(result).to.equal('-2_1/4');
    });

    //simple decimal number
    it('return 2.5 when input 2.5', async () => {
      const result = await calculatePromise('2.5');
      expect(result).to.equal('2.5');
    });

    //simple negative number
    it('return -2 when input -2', async () => {
      const result = await calculatePromise('-2');
      expect(result).to.equal('-2');
    });

    //simple negative decimal number
    it('return -2.5 when input -2.5', async () => {
      const result = await calculatePromise('-2.5');
      expect(result).to.equal('-2.5');
    });

    //division of decimal numbers
    it('return 1/2 when input 2.0 / 4.0', async () => {
      const result = await calculatePromise('2.0 / 4.0');
      expect(result).to.equal('1/2');
    });

    //division of decimal numbers of different polarity
    it('return -1/2 when input 2.0 / -4.0', async () => {
      const result = await calculatePromise('2.0 / -4.0');
      expect(result).to.equal('-1/2');
    });

    it('return -1_2/3 when input 1 - 8 / 3', async () => {
      const result = await calculatePromise('1 - 8 / 3');
      expect(result).to.equal('-1_2/3');
    });

    it('return -1_2/3 when input 1.0 - 8.0 / 3.0', async () => {
      const result = await calculatePromise('1.0 - 8.0 / 3.0');
      expect(result).to.equal('-1_2/3');
    });

    it('return -1_2/3 when input 1 - 2_2/3', async () => {
      const result = await calculatePromise('1 - 2_2/3');
      expect(result).to.equal('-1_2/3');
    });

    it('return -1_2/3 when input 1.0 - 2_2/3', async () => {
      const result = await calculatePromise('1.0 - 2_2/3');
      expect(result).to.equal('-1_2/3');
    });

    it('return -1_2/3 when input 1.0 - 2.0_2.0/3.0', async () => {
      const result = await calculatePromise('1.0 - 2.0_2.0/3.0');
      expect(result).to.equal('-1_2/3');
    });

    //crazy long operation
    it('return -2_130.70000000000005/132 when input is 2 / 3 + 5 * 5 / 6 - 7 / 8 * 9 + 10 / 11 / 12 * 13 - 14 / 15', async () => {
      const result = await calculatePromise('2 / 3 + 5 * 5 / 6 - 7 / 8 * 9 + 10 / 11 / 12 * 13 - 14 / 15');
      expect(result).to.equal('-2_130.70000000000005/132');
    });

    it('Throws "Postfix syntax error" when expression is empty', async () => {
      try {
        await calculatePromise('');
        expect.fail('"Postfix syntax error" is not thrown');
      } catch (error) {
        expect(error.message).to.equal('Postfix syntax error');
      }
    });

    it('Throws "Arithmetic evaluation error" when expression is +', async () => {
      try {
        const result = await calculatePromise('+');
        expect.fail(result, null, '"Arithmetic evaluation error" is not thrown');
      } catch (error) {
        expect(error.message).to.equal('Arithmetic evaluation error');
      }
    });

    it('Throws "Arithmetic evaluation error" when expression is "1 2"', async () => {
      try {
        const result = await calculatePromise('1 2');
        expect.fail(result, null, '"Arithmetic evaluation error" is not thrown');
      } catch (error) {
        expect(error.message).to.equal('Arithmetic evaluation error');
      }
    });

    it('Throws "Arithmetic evaluation error" when expression is "+ 2"', async () => {
      try {
        const result = await calculatePromise('+ 2');
        expect.fail(result, null, '"Arithmetic evaluation error" is not thrown');
      } catch (error) {
        expect(error.message).to.equal('Arithmetic evaluation error');
      }
    });

    it('Throws "Arithmetic evaluation error" when expression is "1 +"', async () => {
      try {
        const result = await calculatePromise('1 +');
        expect.fail(result, null, '"Arithmetic evaluation error" is not thrown');
      } catch (error) {
        expect(error.message).to.equal('Arithmetic evaluation error');
      }
    });

    it('Throws "Arithmetic evaluation error" when expression is "+ +"', async () => {
      try {
        const result = await calculatePromise('+ +');
        expect.fail(result, null, '"Arithmetic evaluation error" is not thrown');
      } catch (error) {
        expect(error.message).to.equal('Arithmetic evaluation error');
      }
    });

    it('Throws "Arithmetic evaluation error" when expression is "1_-2/3"', async () => {
      try {
        const result = await calculatePromise('1_-2/3');
        expect.fail('"Arithmetic evaluation error" not thrown');
      } catch (error) {
        expect(error.message).to.equal('Arithmetic evaluation error');
      }
    });

    it('Throws "Arithmetic evaluation error" when expression is "1_2/-3"', async () => {
      try {
        const result = await calculatePromise('1_2/-3');
        expect.fail('"Arithmetic evaluation error" not thrown');
        console.log
      } catch (error) {
        expect(error.message).to.equal('Arithmetic evaluation error');
      }
    });
  });
});