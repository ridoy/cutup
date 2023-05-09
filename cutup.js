const inputElementId = "text";
const submitButtonId  = "submit";
const outputTextElementId = "output-text";
const removeEmptyCheckboxId = "remove-empty-lines";
const numShufflesInputId = "set-num-shuffles";
const loadExampleInputButtonId = "button--load-example-input";
const shuffleByToggleClassName = "shuffle-by"

const inputElement = document.getElementById(inputElementId);
const submitButton = document.getElementById(submitButtonId);
const outputTextElement = document.getElementById(outputTextElementId);
const removeEmptyCheckbox = document.getElementById(removeEmptyCheckboxId);
const numShufflesInput = document.getElementById(numShufflesInputId);
const loadExampleInputButton = document.getElementById(loadExampleInputButtonId);
const shuffleByToggle = document.getElementsByClassName(shuffleByToggleClassName);

// User preferences
let removeEmptyLines = true;
let numShuffles = 10000;
const shuffleModes = {
    word: "BY_WORD",
    line: "BY_LINE"
};
let shuffleBy = shuffleModes["word"];

submitButton.addEventListener("click", () => {
    let input = inputElement.value;
    outputTextElement.textContent = (shuffleBy == shuffleModes["word"]) ? shuffleByWord(input) : shuffleByLine(input);
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

loadExampleInputButton.addEventListener("click", (e) => {
    loadExampleInput();
});

for (const radio of shuffleByToggle) {
    radio.onclick = (e) => {
        shuffleBy = shuffleModes[e.target.value] || shuffleModes["line"];
    }
}

const shuffleByLine = (text) => {
    let lines = text.split("\n");
    if (removeEmptyLines) {
        lines = lines.filter((line) => line !== "");
    }
    for (let i = 0; i < numShuffles; i++) {
        let first = pickRandomIndexFrom(lines);
        let second = pickRandomIndexFrom(lines);
        let temp = lines[first];
        lines[first] = lines[second];
        lines[second] = temp;
    }
    return lines.join('\n');
}

// TODO Swap words that are the same parts of speech e.g. nouns with nouns
const shuffleByWord = (text) => {
    let lines = text.split("\n");
    if (removeEmptyLines) {
        lines = lines.filter((line) => line !== "");
    }
    let words = lines.map((line) => line.split(" "));
    for (let i = 0; i < numShuffles; i++) {
        let firstLine = pickRandomFrom(words);
        let firstWordIndex = pickRandomIndexFrom(firstLine);
        let secondLine = pickRandomFrom(words);
        let secondWordIndex = pickRandomIndexFrom(secondLine);

        let temp = firstLine[firstWordIndex];
        firstLine[firstWordIndex] = secondLine[secondWordIndex];
        secondLine[secondWordIndex] = temp;
    }
    lines = words.map(line => line.join(" "));
    return lines.join('\n');
}

const loadExampleInput = () => {
    if (lyricsLibrary.length === 0) return;
    let exampleText = '';
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random(lyricsLibrary.length) * lyricsLibrary.length);
        exampleText += lyricsLibrary[randomIndex] + "\n";
    }
    inputElement.value = exampleText;
}

let lyricsLibrary = [];
(function loadLyricsLibrary() {
    // If CutUp is ever hosted elsewhere, this must match the new domain to avoid CORS errors
    const baseUrl = "https://ridoy.github.io/cutup/";
    const urls = [
        "lyrics/dylan.txt",
        "lyrics/oasis.txt",
        "lyrics/strokes.txt"
    ].map(url => baseUrl + url);
    Promise.all(urls.map(url => 
        fetch(url).then(response => response.text())
    )).then(texts => {
        let uniqueLines = new Set();
        texts.forEach(text => {
            text.split("\n").map(line => uniqueLines.add(line.toLowerCase()));
        });
        lyricsLibrary = Array.from(uniqueLines);
    });
})();

const pickRandomFrom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const pickRandomIndexFrom = (arr) => {
    return Math.floor(Math.random() * arr.length);
}
