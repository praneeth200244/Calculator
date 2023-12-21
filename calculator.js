document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  let buttons = document.querySelectorAll(".button-container button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var buttonValue = button.innerText;
      handleButtonClick(buttonValue);
    });
  });

  let expression = "";
  let lastClickedButton = "";

  function updateDisplay() {
    display.value = expression;
  }

  async function handleButtonClick(value) {
    if (value === "=") {
      checkForSqaureRoot();
      expression = expression.replace(/π/g, "Math.PI");
      expression = expression.replace(/\^/g, "**");
      try {
        expression = eval(expression).toString();
      } catch (error) {
        expression = "Error";
      }
    } else if (value === "√") {
      expression += value;
    } else if (value == "π") {
      if (
        expression.length === 0 ||
        expression.charAt(expression.length - 1) === "^" ||
        expression.charAt(expression.length - 1) === "*"
      ) {
        expression += "π";
      } else {
        expression += "*π";
      }
    } else if (value === "!") {
      expression += "!";
      await sleep(500);

      let lastIndex = expression.length - 2;
      let factorialExpression = "";

      while (lastIndex >= 0 && /\d/.test(expression[lastIndex])) {
        factorialExpression = expression[lastIndex] + factorialExpression;
        lastIndex--;
      }
      let result = factorial(parseInt(factorialExpression, 10));
      expression = expression.slice(0, lastIndex + 1) + result;
    } else if (value === "%") {
      expression += "%";
      await sleep(500);

      let lastIndex = expression.length - 2;
      let percentageExpression = "";

      while (
        lastIndex >= 0 &&
        (expression[lastIndex] === "." || /\d/.test(expression[lastIndex]))
      ) {
        percentageExpression = expression[lastIndex] + percentageExpression;
        lastIndex--;
      }
      let result = parseFloat(percentageExpression) / 100;
      expression = expression.slice(0, lastIndex + 1) + result;
    } else if (value === "⌫") {
      expression = expression.slice(0, -1);
    } else if (value === "AC") {
      expression = "";
    } else if (value === "()") {
      if (lastClickedButton === "(") {
        expression += ")";
        await sleep(500);
        let start = expression.indexOf("(");
        let finalResult = eval(expression.slice(start, expression.length));
        expression = expression.slice(0, start) + finalResult;
      } else {
        expression += "(";
        lastClickedButton = "(";
      }
    } else if (/^[0-9]$/.test(value) || value === ".") {
      expression += value;
    } else {
      if (!expression.includes("(") && !expression.includes(")")) {
        checkForSqaureRoot();
      }
      expression += value;
      if (expression.includes("%")) {
        handleButtonClick("%");
      }
    }
    updateDisplay();
  }

  function checkForSqaureRoot() {
    if (expression.includes("√")) {
      let lastIndex = expression.indexOf("√");
      let index = lastIndex + 1;
      let sqaureRootNumber = "";

      while (
        index < expression.length &&
        (expression[index] == "." ||
          /\d/.test(expression[index]) ||
          expression[index] === "(" ||
          expression[index] === ")")
      ) {
        sqaureRootNumber += expression[index];
        index++;
      }
      let result = Math.sqrt(sqaureRootNumber);
      expression = expression.slice(0, lastIndex) + result;
    }
  }

  function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
