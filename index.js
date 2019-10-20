const Rx = require('rxjs');
const RxOperators = require('rxjs/operators')

const OPERATOR_PRECENDENCE = {
  '*': 1,
  '/': 1,
  '+': 0,
  '-': 0
}

function parseOperand(operand, infixTokenSubscriber) {
  if(isNaN(operand) === false) {
    infixTokenSubscriber.next(operand);
  } else {
    const mixedTokens = operand.split('_');
    if (mixedTokens.length !== 2) {
      const fractionalTokens = operand.split('/');
      if (fractionalTokens.length !== 2) {
        infixTokenSubscriber.error(new Error(`Invalid operand: ${operand}`));
      } else {
        if (isNaN(fractionalTokens[0]) || isNaN(fractionalTokens[1])) {
          infixTokenSubscriber.error(new Error(`Invalid operand: ${operand}`));
        } else {
          infixTokenSubscriber.next(operand);
        }
      }
    } else {
      if (isNaN(mixedTokens[0])) {
        infixTokenSubscriber.error(new Error(`Invalid operand: ${operand}`));
      } else {
        const fractionalTokens = mixedTokens[1].split('/');
        if (fractionalTokens.length !== 2) {
          infixTokenSubscriber.error(new Error(`Invalid operand: ${operand}`));
        } else {
          if (isNaN(fractionalTokens[0]) || isNaN(fractionalTokens[1])) {
            infixTokenSubscriber.error(new Error(`Invalid operand: ${operand}`));
          } else {
            infixTokenSubscriber.next(operand);
          }
        }
      }
    }
  }
}

function processToken(token, infixTokenSubscriber) {
  if (OPERATOR_PRECENDENCE[token] === undefined) {
    parseOperand(token, infixTokenSubscriber);
  } else {
    infixTokenSubscriber.next(token);
  }
}

function createInfixTokenStream(infixExpression) {
  return new Rx.Observable(infixTokenSubscriber => {
    var token = '';

    while(infixExpression !== '') {
      const ch = infixExpression.slice(0, 1);
      if (ch === ' ') {
        if (token !== '') {
          processToken(token, infixTokenSubscriber);
        }
        token = '';
      } else {
        token += ch;
      }

      infixExpression = infixExpression.slice(1);
    }

    if (token !== '') {
      processToken(token, infixTokenSubscriber);
    }

    infixTokenSubscriber.complete();
  });
}

/**
 * Arithmetic syntax errors:
 *
 * []
 * [+]
 * [1, 2]
 * [+, 2]
 * [1, +]
 * [+, +]
 */
function buildPostfix(token, postfixTokenSubscriber, conversionStack) {
  if (isNaN(token) === false || OPERATOR_PRECENDENCE[token] === undefined) { //number
    const previousToken = conversionStack.slice(-1)[0];

    if (previousToken !== undefined && isNaN(previousToken) === false) {
      postfixTokenSubscriber.error(new Error('Arithmetic syntax error'));
    }

    conversionStack.push(token);
  } else if (OPERATOR_PRECENDENCE[token] !== undefined) { //operator
    const previousToken = conversionStack.pop();

    postfixTokenSubscriber.next(previousToken);

    const previousOperator = conversionStack.slice(-1)[0]; //peek
    if (
      previousOperator !== undefined &&
      OPERATOR_PRECENDENCE[token] === OPERATOR_PRECENDENCE[previousOperator]
    ) {
      postfixTokenSubscriber.next(conversionStack.pop());
    }

    conversionStack.push(token);
  }
}

function createPostfixTokenStream(infixTokenStream) {
  return new Rx.Observable(postfixTokenSubscriber => {
    infixTokenStream.pipe(
      RxOperators.reduce((conversionStack, token) => {
        buildPostfix(token, postfixTokenSubscriber, conversionStack);
        return conversionStack;
      }, [])
    ).subscribe(conversionStack => {
      let remainingToken = conversionStack.pop();

      while(remainingToken !== undefined) {
        postfixTokenSubscriber.next(remainingToken);
        remainingToken = conversionStack.pop();
      }
    });

    postfixTokenSubscriber.complete();
  });
}

function toMixedNumber(operand) {
  if(isNaN(operand) === false) {
    return [parseFloat(operand), 1]; //[dividend, divisor]
  }

  if (operand.indexOf('_') !== -1) {
    const mixedTokens = operand.split('_');
    const fractionalTokens = mixedTokens[1].split('/');

    return [
      (parseFloat(fractionalTokens[1]) * parseFloat(mixedTokens[0])) + parseFloat(fractionalTokens[0]),
      parseFloat(fractionalTokens[1])
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
      return [
        plusMinus(operator, leftOperand[0], rightOperand[0]),
        leftOperand[1]
      ]
    } else {
      const greaterDivisor = Math.max(leftOperand[1], rightOperand[1]);
      const smallerDivisor = Math.max(leftOperand[1], rightOperand[1]);

      if (greaterDivisor % smallerDivisor === 0) {
        return [
          plusMinus(operator, (
            leftOperand[0] * (greaterDivisor / leftOperand[1])
          ), (
            rightOperand[0] * (greaterDivisor / rightOperand[1])
          )),
          greaterDivisor
        ]
      } else {
        return [
          plusMinus(operator, (
            leftOperand[0] * rightOperand[1]
          ), (
            rightOperand[0] * leftOperand[1]
          )),
          leftOperand[1] * rightOperand[1]
        ]
      }
    }
  } else if (operator === '*') {
    return [
      leftOperand[0] * rightOperand[0],
      leftOperand[1] * rightOperand[1]
    ];
  } else { //division
    return [
      leftOperand[0] * rightOperand[1],
      leftOperand[1] * rightOperand[0]
    ];
  }
}

function calculate(infixExpression) {
  return createPostfixTokenStream(createInfixTokenStream(infixExpression)).pipe(
    RxOperators.reduce((reducedPostfix, token) => {
      if (isNaN(token) && OPERATOR_PRECENDENCE[token] !== undefined) {//arithmetic operator
        const rightOperand = reducedPostfix.pop();
        if (rightOperand === undefined) {
          throw new Error("Arithmetic evaluation error " + token);
        }

        const leftOperand = reducedPostfix.pop();
        if (leftOperand === undefined) {
          throw new Error("Arithmetic evaluation errorx " + token);
        }

        const mixedLeftOperand = Array.isArray(leftOperand) ? leftOperand : toMixedNumber(leftOperand);
        const mixedRightOperand = Array.isArray(rightOperand) ? rightOperand : toMixedNumber(rightOperand);
        const intermediateValue = fractionalCalculation(
          token, mixedLeftOperand, mixedRightOperand
        );

        reducedPostfix.push(intermediateValue);
      } else {
        reducedPostfix.push(token);
      }

      return reducedPostfix;
    }, []),
    RxOperators.map(reducedPostfix => {
      if (reducedPostfix.length > 1) {
        throw new Error("Postfix syntax error");
      }

      const dividend = reducedPostfix[0][0];
      const divisor  = reducedPostfix[0][1];

      const integerPart = Math.floor(dividend / divisor);
      const remainder = dividend % divisor;
      if (remainder === 0) {
        return integerPart.toString();
      } else {
        if (divisor % remainder === 0) {
          return `${integerPart}_1/${divisor / remainder}`;
        } else {
          return `${integerPart}_${remainder}/${divisor}`;
        }
      }
    })
  );
}

module.exports = {
  calculate,
  calculatePromise: (infixExpression) => {
    return calculate(infixExpression).toPromise()
  }
}