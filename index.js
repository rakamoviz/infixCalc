const Rx = require('rxjs');
const RxOperators = require('rxjs/operators');
const {
  toMixedNumber, fractionalCalculation, formatMixedNumber, normalizeStringNumber
} = require('./helper')

const OPERATOR_PRECEDENCE = {
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
  if (OPERATOR_PRECEDENCE[token] === undefined) {
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
 * Arithmetic evaluation errors:
 *
 * []
 * [+]
 * [1, 2]
 * [+, 2]
 * [1, +]
 * [+, +]
 * [1_-2/3]
 * [1_2/-3]
 */
function buildPostfix(token, postfixTokenSubscriber, conversionStack) {
  if (isNaN(token) === false || OPERATOR_PRECEDENCE[token] === undefined) { //number
    const previousToken = conversionStack.slice(-1)[0];

    if (previousToken !== undefined && isNaN(previousToken) === false) {
      postfixTokenSubscriber.error(new Error('Arithmetic evaluation error'));
    }

    conversionStack.push(token);
  } else if (OPERATOR_PRECEDENCE[token] !== undefined) { //operator
    const previousToken = conversionStack.pop();

    postfixTokenSubscriber.next(previousToken);

    if (conversionStack.length === 2) {
      postfixTokenSubscriber.next(conversionStack.pop());
    }

    const previousOperator = conversionStack.slice(-1)[0]; //peek
    if (
      previousOperator !== undefined &&
      (
        OPERATOR_PRECEDENCE[token] === OPERATOR_PRECEDENCE[previousOperator] ||
        OPERATOR_PRECEDENCE[token] < OPERATOR_PRECEDENCE[previousOperator]
      )
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

function calculate(infixExpression) {
  return createPostfixTokenStream(createInfixTokenStream(infixExpression)).pipe(
    /*
    RxOperators.tap(token => {
      console.log("POSTFIXTOKEN::", token)
    }),
    */
    RxOperators.reduce((reducedPostfix, token) => {
      if (isNaN(token) && OPERATOR_PRECEDENCE[token] !== undefined) {//arithmetic operator
        const rightOperand = reducedPostfix.pop();
        if (rightOperand === undefined) {
          throw new Error("Arithmetic evaluation error");
        }

        const leftOperand = reducedPostfix.pop();
        if (leftOperand === undefined) {
          throw new Error("Arithmetic evaluation error");
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

      let temporaryResult = reducedPostfix[0];

      if (Array.isArray(temporaryResult) && temporaryResult.length === 2) {
        const dividend = temporaryResult[0];
        const divisor  = temporaryResult[1];

        return formatMixedNumber(dividend, divisor);
      } else if (typeof temporaryResult === 'string') {
        return normalizeStringNumber(temporaryResult);
      } else {
        throw new Error("Postfix syntax error");
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