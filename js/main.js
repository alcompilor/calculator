const displayEl = document.getElementById("calc-display");
const numBtns = document.getElementsByClassName("num");
const acBtn = document.getElementById("clear");
const operationBtns = document.getElementsByClassName("operation");
const negBtn = document.getElementById("negative");
const percentBtn = document.getElementById("percent");
const equalBtn = document.getElementById("equal");

let opState = false;
let opClickedOnce = false;
let negState = false;
let decState = false;

let opSymbols = {
    "×": "multi",
    "+": "add",
    "-": "subtract",
    "÷": "divide",
};

let keyArray = ["1","2","3","4","5","6","7","8","9","0"];

function calc(method, ...values) {
    let sumValue = arguments[1];
    for (let i = 2; i < arguments.length; i++) {
        if (method === "add") {
            sumValue += arguments[i];
        } else if (method === "subtract") {
            sumValue -= arguments[i];
        } else if (method === "multi") {
            sumValue *= arguments[i];
        } else if (method === "divide") {
            sumValue /= arguments[i];
        }
    }
    return sumValue;
}

function percent(num) {
    return num / 100;
}

function display(value) {
    displayEl.textContent += `${value}`;
}

function singleClear() {
    content = displayEl.textContent;
    if (isNaN(Number(content.charAt(content.length - 2)))){
        content = displayEl.textContent.slice(0, displayEl.textContent.length - 3);
    } else if (!isNaN(Number(content.charAt(content.length - 1)))) {
        content = displayEl.textContent.slice(0, displayEl.textContent.length - 1);
    }
    displayEl.textContent = content;
    opState = true;
}

document.addEventListener("keydown", function() {
    if (window.event.key in keyArray) {
        opState = true;
        negState = true;
        decState = true;
        display(String(window.event.key));
    } else if (window.event.key === "Backspace") {
        singleClear();
    } else if (window.event.key === "Enter") {
        equalFunc();
    }
});

for (let i = 0; i < numBtns.length; i++) {
    numBtns[i].addEventListener("click", function() {
        opState = true;
        negState = true;
        decState = true;
        display(String(numBtns[i].textContent));
    })
}


acBtn.addEventListener("click", singleClear);

acBtn.addEventListener("dblclick", function() {
    negState = false;
    opState = false;
    opClickedOnce = false;
    displayEl.textContent = "";
})

for (let i = 0; i < operationBtns.length; i++) {
    operationBtns[i].addEventListener("click", function() {
        if (operationBtns[i].textContent !== "," && opState && !opClickedOnce) {
            display(` ${String(operationBtns[i].textContent)} `);
            opState = false;
            negState = false;
            opClickedOnce = true;
        } else if (operationBtns[i].textContent !== "," && opState && opClickedOnce) {
            equalFunc();
            display(` ${String(operationBtns[i].textContent)} `);
            opState = false;
            opClickedOnce = true;
        } else if (operationBtns[i].textContent === "," && decState) {
            display(".");
            decState = false;
        }
    })
}

negBtn.addEventListener("click", function() {
    if (!negState) {
        displayEl.textContent += "-";
        negState = true;
    }
})

percentBtn.addEventListener("click", function() {
    content = displayEl.textContent;
    if (content.includes("×") || content.includes("-") || content.includes("+") || content.includes("÷")) {
        equalFunc();
    }
    displayEl.textContent = percent(Number(displayEl.textContent));
})

equalBtn.addEventListener("click", equalFunc);

function equalFunc() {
    let content = displayEl.textContent;
    let firstNum = "";
    let secondNum = "";
    let spaceIndex = 0;
    let opSymbol = "";
    let finalValue = 0;

    if (content.includes("×") || content.includes("-") || content.includes("+") || content.includes("÷")) {
        for (let i = 0; i < content.length; i++) {
            if (content.charAt(i) !== " ") {
                firstNum += content.charAt(i);
            } else {
                spaceIndex = i;
                opSymbol = content.charAt(i+1);
                break
            }
        }

        for (let i = spaceIndex + 3; i < content.length; i++) {
            secondNum += content.charAt(i);
        }
        
        finalValue = calc(opSymbols[opSymbol], Number(firstNum), Number(secondNum));

        if (Number.isInteger(finalValue)) {
            displayEl.textContent = finalValue;
        } else {
            displayEl.textContent = parseFloat(finalValue.toFixed(5));
        }
    }
    
    opClickedOnce = false;
}