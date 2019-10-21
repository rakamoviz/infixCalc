# Getting started

 - npm install
 - Run test cases: npm run test
 - Run CLI: npm run cli
 - Debug core algorithm: npm run algo

The completed solution is in **index.js** (and **helper.js**). The functions in helper.js are carved out index.js, so that they don't have to be exposed by index.js (which will be used by the client-code), and yet the can be imported from the test-codes (i.e.: *test/formatMixedNumber.js*, *test/plusMinus.js*, and *test/toMixedNumber.js*).

However, there is another file named **history/algo.js**. This file contains the core algorithm, that focuses  on infix to postfix conversion. For the sake of simplicity, some concerns are dropped in the **algo.js**; there is no tokenizing & parsing (we just use .split on the infix notation string), no support for mixed number, no fancy "reactive calculator" (more on that in the notes section), not concerned about memory usage (tokenized expression and the resulting postfix tokens are stored entirely in memory), etc.

Throughout development, I often returned to **algo.js** whenever I found a test-case failure (usually related to wrong postfix notation). Debug there, tweak there, and copy over the fix to index.js.

The reason I didn't debug and fix directly in **index.js** is because the stream-ish & FP-ish version of the code (index.js) is slightly different from the straighforward algorithm spelled out in the **algo.js** (it went through a slight refactoring). Reasoning about / debugging chained functions (pipeline) can be challenging at times, so debugging in **algo.js** often helps (it shows a more straightforward picture of the algorithm).

# Notes

My first reaction when I read the problemd description was: AST, a binary tree basically..., and visit the nodes using inorder traversal to compute the final result.

But then, how do we build that AST that respects operator precedence, given an infix expression? Will it be a variation of balancing-tree algorithm, where a subtree is moved and rotated when a certain operator token is plunged into the tree? That sounds overly complicated for a solution.

Then I figured that the correct notation that has operator-precedence built-in is the reverse-polish notation (postfix).

Calculating the result from a postfix notation is relatively simple; we just need a small stack that wouldn't grow bigger than three elements (the processing algorithm itself ensures that it would be limited to that size).

Basically we either:
- In the case of non-streaming solution (**algo.js**): perform a *reduce* on the array of postfix tokens. We push the token to the stack if it's an operand (number). We pop two operands from the stack if the token is an operator, and push the intermediate result back to the stack. Code: https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/history/algo.js#L101. Actually this is a very simplified explanation; some other details (related to operator precedence requires a more involved algorithm, which can be found in **index.js**, the true solution).
- In the case of streaming solution (**index.js**): we don't have array; we are fed with token one-by-one (and we don't buffer them).  Again, we perform *reduce* here: https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/index.js#L281. In case of a "complete expression (e.g.: 1 + 2), the outcome of the reduce would be a tuple [dividend, divisor], which in this case would be [3, 1]. This tuple is formatted to mixed number by invoking **formatMixedNumber**. The other end of the stream (the subscriber) will receive the outcome of that function.

The other block (https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/index.js#L319) serves for the cases where the input expression is a single number, which can be a mixed number, a fraction, or an integer.

When applying the operator here (https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/index.js#L295), we cannot simply use the built-in operator (/,+,-,*). Instead we use the **fractionalCalculation** function that takes into account fractional / mixed numbers, and performs accordingly. For example, '1 / 2 + 3 / 4' will result it '5/4' because we calculate the LCM (least common-multiplication) among the divisors, and adjust the dividends accordingly.

## Motivation (why streaming?)

Because I just think it's interesting to be able to process unlimited length of expression. There is an example of kind-of-long expression in the **test.js** (https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/test/test.js#L243)

When we process such a long expression, we don't want to run into out-of-memory problem; we should minimize buffering. That can be achieved using stream style of programming. The library I use is RxJS ([https://rxjs-dev.firebaseapp.com/](https://rxjs-dev.firebaseapp.com/)), which is member of umbrella project named ReactiveX ([http://reactivex.io/](http://reactivex.io/)).

A consequence of minimal-buffering is we need to perform the calculation real-time, incrementally, on-the-go as additional token arrives. Like what we do here: https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/index.js#L295.

As the name of the library implies **reactive**, it reacts to additional input immediately. Also, "reactive" is often associated with **responsive** (we can feed intermediate values to the subscriber). Plus **scalability** which is a by-product of minimal buffering.

In big picture, the index.js comprise of three streams:

 - infixTokenStream (https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/index.js#L54)
 - postfixTokenStream (https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/index.js#L125)
 - calculation stream (https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/index.js#L274)

Subscriber subscribes to calculation stream, which is a higher-order-stream wrapping around a postfixTokenStream, which in turn is another higher-order-streaming wrapping around infixTokenStream.

The **createInfixTokenStream** generates token out of expression string. However, instead of simply tokenizing the entire string (using String::split for example), it scans character-by-character, and emits token at appropriate points.

The **buildPostfix** (https://github.com/rakamoviz/infixCalc/blob/d585a008c7d199bad1f781d89940284c0a27d3aa/index.js#L92) used by **createPostfixTokenStream** decides whether to emit the token to resulting *postfixTokenStream* or keep it around in the stack, according to infix-to-postfix conversion algorithm.

Finally the **calculate** function that feeds on *postfixTokenStream* apply appropriate arithmetic operation (*fractionalCalculation*) whenever an operator is received from the stream.

## Test cases

So far there are 64 test-cases, which covers invalid syntax situations, and different combination of operands and operators. Output:

> npm run test

> infixcalc@1.0.0 test /home/rcokorda/Projects/Sandbox/infixCalc

> mocha

  Test calculate function
    calculate
 - should return 1_7/8 when input is 1/2 * 3_3/4
 - should return 3_1/2 when input is 2_3/8 + 9/8
 - should return the number when input is a simple number
 - should return the fraction when input is a fraction
 - should return the mixed number when input is a mixed number
 - return simple number when adding two simple numbers
 - return simple number when substracting two simple numbers
 - return simple number when multiplying two simple numbers
 - return 1/2 when input is 1/2
 - return 1/2 when input is 1 / 2
 - return 1/2 when input is 2/4
 - return 1/2 when input is 2 / 4
 - return 3 when input is 1_2/2
 - return 2_1/2 when input is 1_3/2
 - return 1_0/2 when input is 1
 - return 1_2/2 when input is 2
 - return 1_4/2 when input is 3
 - return 7 when input is 1 + 2 * 3
 - return 5 when input is 1 * 2 + 3
 - return 1/6 when input is 1 / 2 / 3
 - return 1/3 when input is 2 / 2 / 3
 - return 1/2 when input is 3 / 2 / 3
 - return 1_1/3 when input is 8 / 2 / 3
 - return 1/3 when input is 8 / 2 / 3 / 4
 - return 7_1/2 when input is 2 * 3 / 4 * 5
 - return 8/15 when input is 2 / 3 * 4 / 5
 - return 1_1/15 when input is 4 / 3 * 4 / 5
 - return 11 when input is 1 + 2 * 3 + 4
 - return 14 when input is 1 * 2 + 3 * 4
 - return 10 when input is 1 * 2 * 3 + 4
 - return 15 when input is 1 + 2 + 3 * 4
 - return 4 when input is 1 + 2 - 3 + 4
 - return -2_1/4 when input is 2 + 3 / 4 - 5
 - return 2.5 when input 2.5
 - return -2 when input -2
 - return -2.5 when input -2.5
 - return -1_2/3 when input -1_2/3
 - return 1/2 when input 2.0 / 4.0
 - return -1/2 when input 2.0 / -4.0
 - return -1_2/3 when input 1 - 8 / 3
 - return -1_2/3 when input 1.0 - 8.0 / 3.0
 - return -1_2/3 when input 1 - 2_2/3
 - return -1_2/3 when input 1.0 - 2_2/3
 - return -1_2/3 when input 1.0 - 2.0_2.0/3.0
 - return -2_1307/1320 when input is 2 / 3 + 5 * 5 / 6 - 7 / 8 * 9 + 10 / 11 / 12 * 13 - 14 / 15
 - Throws "Postfix syntax error" when expression is empty
 - Throws "Arithmetic evaluation error" when expression is +
 - Throws "Arithmetic evaluation error" when expression is "1 2"
 - Throws "Arithmetic evaluation error" when expression is "+ 2"
 - Throws "Arithmetic evaluation error" when expression is "1 +"
 - Throws "Arithmetic evaluation error" when expression is "+ +"
 - Throws "Arithmetic evaluation error" when expression is "1_-2/3"
 - Throws "Arithmetic evaluation error" when expression is "1_2/-3"

  Test formatMixedNumber function
    formatMixedNumber
 - should return -1_2/3 when {dividend: -5, divisor: 3}
 - should return -1_2/3 when operand -1_2/3

  Test plusMinus function
    plusMinus
 - should return 3 when {operator: +, leftValue: 1, rightValue: 2}
 - should return -1 when {operator: +, leftValue: 1, rightValue: -2}
 - should return 1 when {operator: +, leftValue: -1, rightValue: 2}
 - should return -3 when {operator: +, leftValue: -1, rightValue: -2}
 - should return -1 when {operator: -, leftValue: 1, rightValue: 2}
 - should return 3 when {operator: -, leftValue: 1, rightValue: -2}
 - should return -3 when {operator: -, leftValue: -1, rightValue: 2}
 - should return 1 when {operator: -, leftValue: -1, rightValue: -2}

  Test toMixedNumber function
    toMixedNumber
 - should return [-5, 3] when input -1_2/3

  64 passing (31ms)


 - Question: How do we come up with those test-cases?
 - Answer: Combinatorial (e.g.: operand-lowprecedence-operand-highprecedence, operand-highprecedence-operand-lowprecedence, operand-lowprecedence-operand-lowprecedence, operand-highprecedence-operand-highprecedence, and so on), identify corner cases (e.g.: whitespace-padded input, invalid infix notation, etc), etc.

 - Question: How do we know what to expect?
 - Answer: Use the following steps:
1. The final outcome. We can use NodeJS CLI, and just type in the infix expression, and Node will give the correct result. It will give the result in decimal number though.
2. Check to postfix notation that is produced by the code. I use this online tool to help my job: [https://www.mathblog.dk/tools/infix-postfix-converter/](https://www.mathblog.dk/tools/infix-postfix-converter/).
3. Execute the postfix notation obtained in step #2 on paper (running stack machine there), and this will give the mixed number. Make sure this result matches the result obtained in step #1 (it should).
4. Use the mixed number obtained in step #3 in the expection in the test code.
5. If the test fails, check if the postfix notation produced by the code matches with the one obtained in step #2.

## scratchpad_promise.js & scratchpad_rxjs.js
These two files provide examples of how to use the module. There are two functions, **calculate** and **calculatePromise**. If it is preferred to use Promise or async/await, use *calculatePromise*. Otherwise, use *calculate*, which returns an *Observable* ([https://rxjs-dev.firebaseapp.com/guide/observable](https://rxjs-dev.firebaseapp.com/guide/observable)), which you can attach a subscriber to.