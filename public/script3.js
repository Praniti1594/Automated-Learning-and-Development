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
    loop: null
};

const modules = {
    "Functions and Advanced Python": [
        { term: "def", definition: "Defines a function: def my_func():" },
        { term: "lambda", definition: "Anonymous function: lambda x: x+2" },
        { term: "return", definition: "Returns value from function" },
        { term: "recursion", definition: "Function calling itself" },
        { term: "map", definition: "Applies function to iterable" },
        { term: "filter", definition: "Filters elements based on condition" },
        { term: "reduce", definition: "Applies function cumulatively" },
        { term: "args", definition: "Passes multiple arguments to function" },
        { term: "kwargs", definition: "Passes named arguments to function" },
        { term: "decorator", definition: "Modifies function behavior" },
        { term: "generator", definition: "Creates iterators using yield" },
        { term: "closure", definition: "Function with access to outer scope" },
        { term: "scope", definition: "Visibility of variables" },
        { term: "namespace", definition: "Container for variables" },
        { term: "module", definition: "File containing Python code" },
        { term: "package", definition: "Collection of modules" },
        { term: "import", definition: "Includes modules/packages" },
        { term: "exception", definition: "Error during execution" },
        { term: "try-except", definition: "Handles exceptions" },
        { term: "finally", definition: "Executes code after try-except" },
        { term: "raise", definition: "Manually triggers exception" },
        { term: "assert", definition: "Checks if condition is true" },
        { term: "class", definition: "Blueprint for objects" },
        { term: "object", definition: "Instance of a class" },
        { term: "inheritance", definition: "Derives class from another" },
        { term: "polymorphism", definition: "Same function for different types" },
        { term: "encapsulation", definition: "Binds data and functions" },
        { term: "abstraction", definition: "Hides implementation details" },
        { term: "method", definition: "Function defined in a class" },
        { term: "attribute", definition: "Variable defined in a class" },
        { term: "constructor", definition: "Initializes object: __init__" },
        { term: "destructor", definition: "Cleans up object: __del__" },
        { term: "static method", definition: "Method bound to class, not instance" },
        { term: "class method", definition: "Method bound to class" },
        { term: "property", definition: "Manages attribute access" },
        { term: "operator overloading", definition: "Defines custom behavior for operators" },
        { term: "dunder method", definition: "Special method: __str__, __add__" },
        { term: "iterator protocol", definition: "Defines iterable objects" },
        { term: "context manager", definition: "Manages resources: with statement" },
        { term: "decorator chaining", definition: "Applying multiple decorators" },
        { term: "function annotation", definition: "Adds metadata to functions" },
        { term: "type hinting", definition: "Specifies expected data types" },
        { term: "async", definition: "Defines asynchronous function" },
        { term: "await", definition: "Pauses async function execution" },
        { term: "coroutine", definition: "Specialized generator for async" },
        { term: "event loop", definition: "Manages async tasks" },
        { term: "future", definition: "Represents async result" },
        { term: "task", definition: "Schedules coroutines" }
    ]
};

// Use the "Functions and Advanced Python" module by default
const selectModule = () => {
    return modules["Functions and Advanced Python"];
}

// Shuffle an array using Fisher–Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const generateGame = () => {
    // Get a copy of the module's items and shuffle them to randomize the selection
    let items = shuffleArray([...selectModule()]);
    // Then pick a random set of 8 items and create pairs (term and definition)
    let pairs = items.slice(0, 8).flatMap(item => [item.term, item.definition]);
    // Shuffle the pairs so that the term and definition are not adjacent
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
        // Check for matching pair within "Functions and Advanced Python"
        let matchedPair = selectModule().some(pair =>
            (pair.term === text1 && pair.definition === text2) ||
            (pair.term === text2 && pair.definition === text1)
        );

        if (matchedPair) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }
        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    if (!document.querySelectorAll('.card:not(.matched)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>`;
            clearInterval(state.loop);
        }, 1000);
    }
}

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
