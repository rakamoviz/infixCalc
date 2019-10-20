const Rx = require('rxjs');
const RxOperators = require('rxjs/operators')

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
          infixTokenSubscriber.next(parseFloat(fractionalTokens[0]) / parseFloat(fractionalTokens[1]));
        }
      }
    } else {
      if (isNaN(mixedTokens[0])) {
        infixTokenSubscriber.error(new Error(`Invalid operand: ${operand}`));
      } else {
        let mixedValue = parseFloat(mixedTokens[0]);
        const fractionalTokens = mixedTokens[1].split('/');
        if (fractionalTokens.length !== 2) {
          infixTokenSubscriber.error(new Error(`Invalid operand: ${operand}`));
        } else {
          if (isNaN(fractionalTokens[0]) || isNaN(fractionalTokens[1])) {
            infixTokenSubscriber.error(new Error(`Invalid operand: ${operand}`));
          } else {
            mixedValue += (parseFloat(fractionalTokens[0]) / parseFloat(fractionalTokens[1]));
            infixTokenSubscriber.next(mixedValue.toString());
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
  if (isNaN(token) === false) {
    const previousToken = conversionStack.slice(-1)[0];

    if (previousToken !== undefined && isNaN(previousToken) === false) {
      postfixTokenSubscriber.error(new Error('Arithmetic syntax error'));
    }

    conversionStack.push(token);
  } else {
    if (OPERATOR_PRECEDENCE[token] === undefined) {
      postfixTokenSubscriber.error(new Error(`Unknown operator: ${token}`));
    }

    const previousToken = conversionStack.pop();

    if (isNaN(previousToken)) {
      postfixTokenSubscriber.error(new Error('Arithmetic syntax error'));
    }

    postfixTokenSubscriber.next(previousToken);

    if (conversionStack.length === 2) {
      postfixTokenSubscriber.next(token);
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
      if (isNaN(remainingToken)) {
        postfixTokenSubscriber.error(new Error('Arithmetic syntax error'));
      }

      while(remainingToken !== undefined) {
        postfixTokenSubscriber.next(remainingToken);
        remainingToken = conversionStack.pop();
      }
    });

    postfixTokenSubscriber.complete();
  });
}

const operatorFns = {
  '*': (leftOperand, rightOperand) => {
    return leftOperand * rightOperand;
  },
  '/': (leftOperand, rightOperand) => {
    return leftOperand / rightOperand;
  },
  '+': (leftOperand, rightOperand) => {
    return leftOperand + rightOperand;
  },
  '-': (leftOperand, rightOperand) => {
    return leftOperand - rightOperand;
  }
}

function calculate(infixExpression) {
  return createPostfixTokenStream(createInfixTokenStream(infixExpression)).pipe(
    RxOperators.reduce((reducedPostfix, token) => {
      if (isNaN(token)) {//arithmetic operator
        const rightOperand = reducedPostfix.pop();
        if (rightOperand === undefined) {
          throw new Error("Arithmetic evaluation error");
        }

        const leftOperand = reducedPostfix.pop();
        if (leftOperand === undefined) {
          throw new Error("Arithmetic evaluation error");
        }

        const intermediateValue = operatorFns[token](
          parseFloat(leftOperand), parseFloat(rightOperand)
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

       return reducedPostfix[0];
    })
  );
}

module.exports = {
  calculate,
  calculatePromise: (infixExpression) => {
    return calculate(infixExpression).toPromise()
  }
}