//#region Variables
//the array that holds all the cards
let cards = [
    'fa-apple-alt',
    'fa-paper-plane',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb',
    'fa-apple-alt',
    'fa-paper-plane',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb'
];
let openCards = [];
let moves = 0;
let matchedCardsCounter = 0;
let timer;
let totalSeconds = 0;
let minutesLabel = document.querySelector('.timer .minutes');
let secondsLabel = document.querySelector('.timer .seconds');

const ul = document.querySelector('.deck');
const restartButton = document.querySelector('.restart');
const successModal = document.querySelector('.success-modal');
const closeButton = document.querySelector('.close-button');
const playAgainButton = document.querySelector('.play-again');
//#endregion Variables

//#region External Functions
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Timer functionality from https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript updated to ES6
function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    let valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}
//#endregion External Functions

//#region Functions
function startGame() {
    //shuffle the list of cards
    shuffle(cards);
    //loop through each card and create its HTML
    for (let card of cards) {
        const li = document.createElement('li');
        li.className = 'card';
        const i = document.createElement('i');
        i.classList.add('fas', card);
        li.appendChild(i);
        //add each card's HTML to the page
        ul.appendChild(li);
    }
    //set up event listeners
    ul.addEventListener('click', startTimer);
    restartButton.addEventListener('click', restart);
    playAgainButton.addEventListener('click', restart);
    closeButton.addEventListener('click', closeDialog);
    successModal.addEventListener('click', closeFromBackdrop);
    dialogPolyfill.registerDialog(successModal);
}

function startTimer(event) {
    if (event.target.tagName.toLowerCase() === 'li') {
        //set up the event listener to start the timer on the first click only.
        timer = setInterval(setTime, 1000);
        reveal(event);
        ul.removeEventListener('click', startTimer);
        //set up event listener to the card.
        ul.addEventListener('click', reveal);
    }
}

function reveal(event) {
    //if a card is clicked display the card's symbol
    if (event.target.tagName.toLowerCase() === 'li' && openCards.length !== 2) {
        const card = event.target;
        if (!card.className.includes('open') && !card.className.includes('match')) {
            card.classList.add('open');
            card.classList.add('show');
            addToOpenCards(card);
            incrementMoves();
            if (moves === 24 || moves === 32 || moves === 36 || moves === 38) {
                decreaseRating();
            }
        }
    }
}

function addToOpenCards(card) {
    //add the card to a *list* of "open" cards
    if (openCards.length < 2) {
        openCards.push(card);
    }
    //if the list already has another card, check to see if the two cards match
    if (openCards.length === 2) {
        if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
            //if the cards do match, lock the cards in the open position
            lockMatchedCardsOpen(openCards);
        } else {
            //if the cards do not match, close unmatched cards after a while
            setTimeout(closeUnmatchedCards, 500, openCards);
        }
    }
}

function lockMatchedCardsOpen(openCards) {
    //lock the cards in the open position
    for (const openCard of openCards) {
        openCard.className = 'card match';
    }
    openCards.length = 0;
    matchedCardsCounter += 2;
    //if all cards have matched, display a message with the final score
    if (matchedCardsCounter === 16) {
        gameOver();
    }
}

function closeUnmatchedCards(openCards) {
    //hide the card's symbol
    for (const openCard of openCards) {
        openCard.className = 'card';
    }
    //remove the cards from the list
    openCards.length = 0;
}

function incrementMoves() {
    //increment the move counter and display it on the page
    moves += 1;
    const movesCounter = document.querySelector('.moves');
    movesCounter.textContent = moves;
}

function decreaseRating(stars) {
    //take one star off the rating
    let lastStar = document.querySelector('.stars li.last');
    lastStar.firstElementChild.className = 'far fa-star'
    lastStar.previousElementSibling.classList.add('last');
    lastStar.classList.remove('last');
}

function restart(event) {
    //if the restart was triggered from the dialog close the dialog first
    if (event.target === playAgainButton) {
        successModal.close('play again');
    }
    //empty all data and restart the game
    ul.innerHTML = '';
    openCards.length = 0;
    moves = 0;
    matchedCardsCounter = 0;
    totalSeconds = 0;
    document.querySelector('.moves').textContent = 0;
    document.querySelector('.stars li.last').classList.remove('last');
    document.querySelector('.stars').lastElementChild.className = 'last';
    const emptyStars = document.querySelectorAll('.stars li i.far.fa-star');
    for (emptyStar of emptyStars) {
        emptyStar.className = 'fas fa-star';
    }
    stopTimer();
    startGame();
}

function stopTimer() {
    clearInterval(timer);
    minutesLabel.textContent = '00';
    secondsLabel.textContent = '00';
}

function gameOver() {
    //stop the timer then show the dialog with the timer and rating result
    clearInterval(timer);
    successModal.showModal();
    document.querySelector('.timer-result').innerHTML = document.querySelector('.timer').innerHTML;
    document.querySelector('.stars.rating-result').innerHTML = document.querySelector('.stars').innerHTML;
}

function closeDialog() {
    successModal.close();
}

function closeFromBackdrop(event) {
    if (event.target === successModal) {
        closeDialog();
    }
}
//#endregion Functions

startGame();