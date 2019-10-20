const operatorPrecedence = {
  '*': 1,
  '/': 1,
  '+': 0,
  '-': 0
}
const operators = Object.keys(operatorPrecedence);

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
function infixToPostfix(tokensInfix) {
  const conversionStack = [];
  const tokensPostfix = [];

  tokensInfix.forEach(token => {
    if (token === '-') {
      console.log('>>>>: ', token);
      console.log({conversionStack, tokensPostfix});
    }

    if (isNaN(token) === false) {
      const previousToken = conversionStack.slice(-1)[0];

      if (previousToken !== undefined && isNaN(previousToken) === false) {
        throw new Error(`Arithmetic syntax error: ${tokensInfix.join(' ')}`);
      }

      conversionStack.push(token);
    } else {
      if (operators.indexOf(token) === -1) {
        throw new Error(`Unknown operator: ${token}`);
      }

      const previousToken = conversionStack.pop();

      if (isNaN(previousToken)) {
        throw new Error(`Arithmetic syntax error: ${tokensInfix.join(' ')}`);
      }

      tokensPostfix.push(previousToken);

      if (conversionStack.length === 2) {
        if (token === '-') console.log("HA.03 ", {conversionStack, tokensPostfix})
        tokensPostfix.push(conversionStack.pop());
        if (token === '-') console.log("HA.03.b ", {conversionStack, tokensPostfix})
      }

      const previousOperator = conversionStack.slice(-1)[0]; //peek
      if (
        previousOperator !== undefined &&
        (
          operatorPrecedence[token] === operatorPrecedence[previousOperator] ||
          operatorPrecedence[token] < operatorPrecedence[previousOperator]
        )
      ) {
        if (token === '-') console.log("HA.01")
        tokensPostfix.push(conversionStack.pop());
      } else {
        if (token === '-') console.log("HA.02")
      }

      conversionStack.push(token);
    }

    if (token === '-') {
      console.log({conversionStack, tokensPostfix});
      console.log('<<<')
    }
  });

  //if (token === '-') {
    console.log("====> ", {conversionStack});
  //}

  let remainingToken = conversionStack.pop();
  if (isNaN(remainingToken)) {
    throw new Error(`Arithmetic syntax error: ${tokensInfix.join(' ')}`);
  }

  while(remainingToken !== undefined) {
    tokensPostfix.push(remainingToken);
    remainingToken = conversionStack.pop();
  }

  return tokensPostfix;
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

const infixExpression = '2 + 3 / 4 - 5';
//const infixExpression = '2 + 3 / 4 - 5';

const tokensInfix = infixExpression.split(' ')
  .map(token => token.trim())
  .filter(token => token !== '');

const tokensPostfix = infixToPostfix(tokensInfix);

console.log(tokensPostfix)

const reducedPostfix = tokensPostfix.reduce((acc, token) => {
  if (isNaN(token)) {//operator
    const rightOperand = acc.pop();
    if (rightOperand === undefined) {
      throw new Error("Arithmetic evaluation error");
    }

    const leftOperand = acc.pop();
    if (leftOperand === undefined) {
      throw new Error("Arithmetic evaluation error");
    }

    const intermediateValue = operatorFns[token](
      parseFloat(leftOperand), parseFloat(rightOperand)
    );

    acc.push(intermediateValue);
  } else {
    acc.push(token);
  }

  return acc;
}, []);

if (reducedPostfix.length > 1) {
 throw new Error("Postfix syntax error");
}

console.log(reducedPostfix[0]);