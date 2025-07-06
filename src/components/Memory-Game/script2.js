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
    
    "Loops in Python": [
        { term: "for loop", definition: "Iterates over items: for i in range(5):" },
        { term: "while loop", definition: "Repeats until condition is false" },
        { term: "break", definition: "Exits loop immediately" },
        { term: "continue", definition: "Skips current iteration" },
        { term: "range", definition: "Generates number sequences" },
        { term: "enumerate", definition: "Gets index and value in loops" },
        { term: "zip", definition: "Pairs elements from multiple lists" },
        { term: "list comprehension", definition: "Short loop-based list creation" },
        { term: "nested loop", definition: "Loop inside another loop" },
        { term: "iterator", definition: "Object that can be iterated using next()" },
        { term: "iterable", definition: "Object that can be looped over" },
        { term: "generator", definition: "Creates iterators using yield" },
        { term: "infinite loop", definition: "Loop that never ends" },
        { term: "loop control", definition: "Managing loop execution" },
        { term: "else in loops", definition: "Executes after loop completes" },
        { term: "loop variable", definition: "Variable used in loop iteration" },
        { term: "loop body", definition: "Code executed in each iteration" },
        { term: "loop condition", definition: "Condition checked before each iteration" },
        { term: "loop initialization", definition: "Setting up loop variables" },
        { term: "loop update", definition: "Modifying loop variables" },
        { term: "loop termination", definition: "Ending loop execution" },
        { term: "loop optimization", definition: "Improving loop performance" },
        { term: "loop nesting", definition: "Placing loops inside other loops" },
        { term: "loop unrolling", definition: "Reducing loop overhead" },
        { term: "loop invariant", definition: "Condition true before and after each iteration" },
        { term: "loop counter", definition: "Variable tracking loop iterations" },
        { term: "loop index", definition: "Position of current iteration" },
        { term: "loop range", definition: "Sequence of loop iterations" },
        { term: "loop step", definition: "Increment/decrement value in loop" },
        { term: "loop breakpoint", definition: "Debugging tool for loops" },
        { term: "loop profiling", definition: "Analyzing loop performance" },
        { term: "loop parallelization", definition: "Running loop iterations in parallel" },
        { term: "loop vectorization", definition: "Optimizing loops for arrays" },
        { term: "loop fusion", definition: "Combining multiple loops into one" },
        { term: "loop fission", definition: "Splitting a loop into multiple loops" },
        { term: "loop interchange", definition: "Swapping loop order" },
        { term: "loop tiling", definition: "Breaking loops into smaller chunks" },
        { term: "loop unswitching", definition: "Moving conditionals outside loops" },
        { term: "loop peeling", definition: "Removing first/last iterations" },
        { term: "loop skewing", definition: "Changing loop iteration order" },
        { term: "loop reversal", definition: "Reversing loop iteration order" },
        { term: "loop splitting", definition: "Dividing loop into parts" },
        { term: "loop merging", definition: "Combining loops with similar bodies" },
        { term: "loop distribution", definition: "Splitting loop into independent loops" },
        { term: "loop blocking", definition: "Grouping loop iterations" },
        { term: "loop unrolling factor", definition: "Number of iterations combined" },
        { term: "loop dependency", definition: "Relationship between loop iterations" },
        { term: "loop-carried dependency", definition: "Dependency across iterations" },
        { term: "loop-independent dependency", definition: "Dependency within iteration" },
        { term: "loop transformation", definition: "Changing loop structure" }
    ]
};

// Use the "Loops in Python" module by default
const selectModule = () => {
    return modules["Loops in Python"];
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
        // Check for matching pair within "Loops in Python"
        let matchedPair = modules["Loops in Python"].some(pair =>
            (pair.term === text1 && pair.definition === text2) || (pair.term === text2 && pair.definition === text1)
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
