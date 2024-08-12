const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');

const cardsArray = [
  './1.png','./1.png',
  './2.png','./2.png',
  './3.png','./3.png',
  './4.png','./4.png',
  './5.png','./5.png',
  './6.png','./6.png',
  './7.png','./7.png',
  './8.png','./8.png'
];
let shuffledCards = [];
let flippedCards = [];
let matchedCards = [];
let timer;
let startTime;

function startTimer() {
    startTime = new Date();
    timer = setInterval(() => {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        timerElement.textContent = `Time: ${elapsedTime}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function shuffleCards() {
    shuffledCards = [...cardsArray].sort(() => Math.random() - 0.5);
}

function createBoard() {
    gameBoard.innerHTML = '';
    scoreElement.style.display = 'none';  // Hide score when the game starts
    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;

        const cardImage = document.createElement('img');
        cardImage.src = card;
        cardImage.classList.add('card-image');

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        cardElement.appendChild(cardImage);
        cardElement.appendChild(overlay);
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
    startTimer(); // Start the timer when the board is created
}

function flipCard(event) {
    const clickedCard = event.currentTarget;
    if (flippedCards.length < 2 && !clickedCard.classList.contains('flipped') && !matchedCards.includes(clickedCard)) {
        clickedCard.classList.add('flipped');
        clickedCard.querySelector('.overlay').style.opacity = '0';
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        if (matchedCards.length === shuffledCards.length) {
            stopTimer();
            setTimeout(() => {
                const elapsedTime = Math.floor((new Date() - startTime) / 1000);
                showScore(elapsedTime);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.querySelector('.overlay').style.opacity = '1';
            card2.querySelector('.overlay').style.opacity = '1';
            flippedCards = [];
        }, 1000);
    }
}

function showScore(elapsedTime) {
    gameBoard.style.display = 'none';  // Hide the game board
    scoreElement.textContent = `Score: ${elapsedTime}s`;
    scoreElement.style.display = 'flex'; // Show the score card
}

resetButton.addEventListener('click', () => {
    shuffleCards();
    createBoard();
    flippedCards = [];
    matchedCards = [];
    stopTimer(); // Stop the timer when the game is reset
    timerElement.textContent = 'Time: 0s';
    gameBoard.style.display = 'flex'; // Ensure the game board is visible
    scoreElement.style.display = 'none';  // Hide the score card
});

shuffleCards();
createBoard();
