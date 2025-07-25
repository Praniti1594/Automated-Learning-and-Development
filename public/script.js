const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    correctMatches: 0,
    incorrectAttempts: 0
};

const modules = {
    "Basics of Python": [
        { term: "Variable", definition: "A named storage for data, e.g., x = 5" },
        { term: "Data Type", definition: "Types of data like int, float, str, list" },
        { term: "Operator", definition: "+, -, *, / for arithmetic operations" },
        { term: "Conditional", definition: "if, elif, else statements for decision making" },
        { term: "List", definition: "A collection of items: [1, 2, 3]" },
        { term: "Tuple", definition: "Immutable list: (1, 2, 3)" },
        { term: "Dictionary", definition: "Key-value pairs: {'a': 1, 'b': 2}" },
        { term: "Set", definition: "Unordered collection of unique items: {1, 2, 3}" },
        { term: "Loop", definition: "Repeating statements using for, while" },
        { term: "Function", definition: "Reusable code block: def func():" },
        { term: "String", definition: "Sequence of characters: 'Hello'" },
        { term: "Integer", definition: "Whole number: 42" },
        { term: "Float", definition: "Decimal number: 3.14" },
        { term: "Boolean", definition: "True or False value" },
        { term: "None", definition: "Represents absence of value" },
        { term: "Indexing", definition: "Accessing elements by position: my_list[0]" },
        { term: "Slicing", definition: "Extracting a portion of a sequence: my_list[1:3]" },
        { term: "Concatenation", definition: "Combining strings: 'Hello' + 'World'" },
        { term: "Type Conversion", definition: "Converting one data type to another: int('5')" },
        { term: "Input", definition: "Reading user input: input('Enter a number:')" },
        { term: "Output", definition: "Displaying data: print('Hello')" },
        { term: "Comment", definition: "Non-executable note: # This is a comment" },
        { term: "Module", definition: "File containing Python code: import math" },
        { term: "Package", definition: "Collection of modules: import numpy" },
        { term: "Exception", definition: "Error during execution: try, except" },
        { term: "File Handling", definition: "Reading/writing files: open('file.txt')" },
        { term: "List Method", definition: "Functions for lists: append(), remove()" },
        { term: "Tuple Method", definition: "Functions for tuples: count(), index()" },
        { term: "Dictionary Method", definition: "Functions for dictionaries: keys(), values()" },
        { term: "Set Method", definition: "Functions for sets: add(), union()" },
        { term: "String Method", definition: "Functions for strings: upper(), lower()" },
        { term: "Arithmetic Operator", definition: "+, -, *, /, %, **" },
        { term: "Comparison Operator", definition: "==, !=, >, <, >=, <=" },
        { term: "Logical Operator", definition: "and, or, not" },
        { term: "Membership Operator", definition: "in, not in" },
        { term: "Identity Operator", definition: "is, is not" },
        { term: "Bitwise Operator", definition: "&, |, ^, ~, <<, >>" },
        { term: "Assignment Operator", definition: "=, +=, -=, *=, /=" },
        { term: "If Statement", definition: "Executes code if condition is true" },
        { term: "Else Statement", definition: "Executes code if condition is false" },
        { term: "Elif Statement", definition: "Checks multiple conditions" },
        { term: "Nested If", definition: "If statement inside another if" },
        { term: "Ternary Operator", definition: "Short if-else: x if condition else y" },
        { term: "For Loop", definition: "Iterates over a sequence" },
        { term: "While Loop", definition: "Repeats while condition is true" },
        { term: "Break Statement", definition: "Exits the loop" },
        { term: "Continue Statement", definition: "Skips current iteration" },
        { term: "Pass Statement", definition: "Placeholder for future code" },
        { term: "Range Function", definition: "Generates a sequence of numbers" }
    ]
};

const selectModule = () => {
    return modules["Basics of Python"];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const generateGame = () => {
    let items = selectModule();
    let pairs = items.slice(0, 8).flatMap(item => [item.term, item.definition]);
    pairs = shuffleArray(pairs);

    selectors.board.style.gridTemplateColumns = "repeat(4, 1fr)";

    let html = '';
    pairs.forEach(text => {
        html += `
        <div class="card">
            <div class="card-front"></div>
            <div class="card-back">${text}</div>
        </div>`;
    });

    selectors.board.innerHTML = html;
}

const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');

    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.moves.innerText = `${state.totalFlips} moves`;
        selectors.timer.innerText = `Time: ${state.totalTime} sec`;
    }, 1000);
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });
    state.flippedCards = 0;
}

const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');
        let text1 = flippedCards[0].querySelector('.card-back').innerText;
        let text2 = flippedCards[1].querySelector('.card-back').innerText;
        // Check for matching pair within "Basics of Python"
        let matchedPair = modules["Basics of Python"].some(pair =>
            (pair.term === text1 && pair.definition === text2) || (pair.term === text2 && pair.definition === text1)
        );

        if (matchedPair) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            state.correctMatches++;
        } else {
            state.incorrectAttempts++;
        }
        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    if (!document.querySelectorAll('.card:not(.matched)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped');

            // Calculate performance insights
            const totalAttempts = state.correctMatches + state.incorrectAttempts;
            const accuracy = totalAttempts > 0 ? ((state.correctMatches / totalAttempts) * 100).toFixed(1) : 0;
            const avgTimePerMatch = state.correctMatches > 0 ? (state.totalTime / state.correctMatches).toFixed(1) : 0;

            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
                <canvas id="pieChart" width="400" height="400"></canvas>
                <div class="insights">
                    <h3>Your Performance Insights</h3>
                    <p>Accuracy: <strong>${accuracy}%</strong></p>
                    <p>Average Time per Match: <strong>${avgTimePerMatch} sec</strong></p>
                </div>`;
            clearInterval(state.loop);
            createPieChart();
        }, 1000);
    }
}

const createPieChart = () => {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Correct Matches', 'Incorrect Attempts'],
            datasets: [{
                data: [state.correctMatches, state.incorrectAttempts],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Game Performance' }
            }
        }
    });
};

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
}

generateGame();
attachEventListeners();
