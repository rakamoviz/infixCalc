function toMixedNumber(operand) {
  if(isNaN(operand) === false) {
    return [parseFloat(operand), 1]; //[dividend, divisor]
  }

  if (operand.indexOf('_') !== -1) {
    const mixedTokens = operand.split('_');
    const fractionalTokens = mixedTokens[1].split('/');

    const integerPart = parseFloat(mixedTokens[0]);
    const dividend = parseFloat(fractionalTokens[0]);
    const divisor = parseFloat(fractionalTokens[1]);

    if (dividend < 0 || divisor < 0) {
      throw new Error('Arithmetic evaluation error');
    }

    const absIntegerPart = Math.abs(integerPart);
    const absDividend = Math.abs(dividend);
    const absDivisor = Math.abs(divisor);

    return [
      ((absDivisor * absIntegerPart) + absDividend) * (integerPart < 0 ? -1 : 1),
      absDivisor
    ];
  } else {
    const fractionalTokens = operand.split('/');
    return [
      parseFloat(fractionalTokens[0]),
      parseFloat(fractionalTokens[1])
    ];
  }
}

function plusMinus(operator, leftValue, rightValue) {
  if (operator === '+') {
    return leftValue + rightValue;
  } else {
    return leftValue - rightValue;
  }
}

function fractionalCalculation(operator, leftOperand, rightOperand) {
  if (operator === '+' || operator === '-') {
    if (leftOperand[1] === rightOperand[1]) {
      ret = [
        plusMinus(operator, leftOperand[0], rightOperand[0]),
        leftOperand[1]
      ]
    } else {
      const lcm = leastCommonMultiplication(Math.abs(leftOperand[1]), Math.abs(rightOperand[1]));
      const leftMultiplier = lcm / leftOperand[1];
      const rightMultiplier = lcm / rightOperand[1];

      ret = [
        plusMinus(
          operator,
          Math.abs(leftOperand[0]) * leftMultiplier * (leftOperand[0] / leftOperand[1] < 0 ? -1 : 1),
          Math.abs(rightOperand[0]) * rightMultiplier * (rightOperand[0] / rightOperand[1] < 0 ? -1 : 1)
        ),
        lcm
      ]
    }
  } else if (operator === '*') {
    ret = [
      leftOperand[0] * rightOperand[0],
      leftOperand[1] * rightOperand[1]
    ];
  } else { //division
    ret = [
      leftOperand[0] * rightOperand[1],
      leftOperand[1] * rightOperand[0]
    ];
  }

  return ret;
}

function greatestCommonDenominator(dividend, divisor) {
  if (dividend === divisor) {
    return divisor;
  }

  if (dividend === 1 || divisor === 1) {
    return 1;
  }

  const biggerNumber = Math.max(dividend, divisor);
  const smallerNumber = Math.min(dividend, divisor);

  const remainder = biggerNumber % smallerNumber;

  if (remainder === 0) {
    return smallerNumber;
  }

  return greatestCommonDenominator(smallerNumber, remainder);
}

function leastCommonMultiplication(first, second) {
  return (first * second) / greatestCommonDenominator(first, second);
}

function formatMixedNumber(dividend, divisor) {
  if (parseFloat(divisor) === 0) {
    throw new Error('Arithmetic evaluation error');
  }

  if (dividend === 0) {
    return integerPart.toString();
  }

  const minusSign = dividend / divisor < 0 ? '-' : '';
  const absDividend = Math.abs(dividend);
  const absDivisor = Math.abs(divisor);
  const gcd = greatestCommonDenominator(absDividend, absDivisor);



  const integerPart = Math.floor(absDividend / absDivisor);
  if (integerPart === 0) {
    //dividend is less than divisor
    return `${minusSign}${absDividend / gcd}/${absDivisor / gcd}`;
  }

  //at this point we can be sure absDividen > absDivisor
  const remainingDividend = absDividend % absDivisor;
  if (remainingDividend === 0) {
    return `${minusSign}${integerPart}`;
  }


  //mixed-number (i.e.: a_b/c)
  const gcdMixed = greatestCommonDenominator(remainingDividend, absDivisor);

  return `${minusSign}${integerPart}_${remainingDividend / gcdMixed}/${absDivisor / gcdMixed}`;
}

module.exports = {
  toMixedNumber, plusMinus, fractionalCalculation, formatMixedNumber
}