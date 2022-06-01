const inputElementId = "text";
const submitButtonId  = "submit";
const outputElementId = "output";
const removeEmptyCheckboxId = "remove-empty-lines";
const numShufflesInputId = "set-num-shuffles";
const loadExampleButtonId = "button-load-example";

const inputElement = document.getElementById(inputElementId);
const submitButton = document.getElementById(submitButtonId);
const outputElement = document.getElementById(outputElementId);
const removeEmptyCheckbox = document.getElementById(removeEmptyCheckboxId);
const numShufflesInput = document.getElementById(numShufflesInputId);
const loadExampleButton = document.getElementById(loadExampleButtonId);

let removeEmptyLines = true;
let numShuffles = 10000;

submitButton.addEventListener("click", () => {
    let input = inputElement.value;
    outputElement.textContent = shuffleByWord(input);
});

removeEmptyCheckbox.addEventListener("change", (e) => {
    removeEmptyLines = (e.target.checked) ? true : false;
});

numShufflesInput.addEventListener("change", (e) => {
    if (e.target.value > 1000000 ) { // For performance reasons
        numShuffles = 1000000;
    } else {
        numShuffles = e.target.value;
    }
});

loadExampleButton.addEventListener("click", (e) => {
    loadExampleInput();
});

const shuffleByLine = (text) => {
    let lines = text.split("\n");
    if (removeEmptyLines) {
        lines = lines.filter((line) => line !== "");
    }
    for (let i = 0; i < numShuffles; i++) {
        let first = Math.floor(Math.random() * lines.length);
        let second = Math.floor(Math.random() * lines.length);
        let temp = lines[first];
        lines[first] = lines[second];
        lines[second] = temp;
    }
    return lines.join('\n');
}

// TODO fix capitalization
// TODO Swap words that are the same parts of speech e.g. nouns with nouns
const shuffleByWord = (text) => {
    let lines = text.split("\n");
    if (removeEmptyLines) {
        lines = lines.filter((line) => line !== "");
    }
    let words = lines.map((line) => line.split(" "));
    for (let i = 0; i < numShuffles; i++) {
        let firstLine = words[Math.floor(Math.random() * lines.length)];
        let firstWordIndex = Math.floor(Math.random() * firstLine.length);
        let secondLine = words[Math.floor(Math.random() * lines.length)];
        let secondWordIndex = Math.floor(Math.random() * secondLine.length);

        let temp = firstLine[firstWordIndex];
        firstLine[firstWordIndex] = secondLine[secondWordIndex];
        secondLine[secondWordIndex] = temp;
    }
    lines = words.map(line => line.join(" "));
    return lines.join('\n');
}

const loadExampleInput = () => {
    fetch('http://cratevst.com/cutup/all-star.txt')
        .then(response => response.text())
        .then(text => console.log(text));

}
