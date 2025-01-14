const cards = document.querySelectorAll('.memory-card');
const backcards = document.querySelectorAll('.backface');
const restartBtn = document.querySelector('.restert');
const movesDisplay = document.querySelector('.Moves');
const countdown = document.querySelector('#countdown');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const secondModel = document.querySelector('.second-model');
const movesModel = document.querySelector('.move-model');
const gameOverModal = document.querySelector('.GameOver');
const audio = document.getElementById('audio');

let lockBoard = false;
let hasFlippedCard = false;
let firstCard, secondCard;
let firstBackFace, secondBackFace;
let randomPos;
let movesCount = 0;
let startingMinutes = 1;
let time = startingMinutes * 120;
let interval;
let correctMatches = 0;

const startAudio = new Audio('audio/audiostart.mp3');
const matchAudio = new Audio('audio/match.mp3');
const loseAudio = new Audio('audio/lose.mp3');
const winAudio = new Audio('audio/winn.mp3');
const musicAudio = new Audio('audio/music.mp3');

/******** Functions ********/

// Starts the game with flipped cards animation
function startGame() {
  cards.forEach(card => {
    card.classList.add('flip');
  });

  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('flip');
    });
  }, 1000);
}

// Open modal with stats
const openModal = () => {
  modal.classList.remove('visibilty');
  overlay.classList.remove('visibilty');
  movesModel.textContent = movesCount;
  secondModel.textContent = countdown.textContent;
};

// Close modal and reload the page
const closeModal = () => {
  modal.classList.add('visibilty');
  overlay.classList.add('visibilty');
  gameOverModal.classList.add('visibilty');
  location.reload();
};

// Start the countdown timer
function startTimer() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  const timeDisplay = `${minutes}:${seconds}`;
  countdown.innerHTML = timeDisplay;
  time--;

  if (timeDisplay === '0:00') {
    musicAudio.pause();
    loseAudio.play();
    gameOverModal.classList.remove('visibilty');
    overlay.classList.remove('visibilty');
    clearInterval(interval);
    correctMatches = 0;
  }
}

// Reset the board after a match or flip
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
  [firstBackFace, secondBackFace] = [null, null];
}

// Check if cards match
function checkForMatch() {
  if (firstCard.dataset.category === secondCard.dataset.category) {
    setTimeout(() => {
      matchAudio.play();
      lockBoard = false;
      firstCard.classList.add('visibilty');
      secondCard.classList.add('visibilty');
      resetBoard();
      correctMatches++;
    }, 1000);
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
    }, 1500);
  }
}

// Shuffle the cards and assign random order
(function shuffle() {
  startAudio.play();
  setTimeout(() => {
    startAudio.pause();
    musicAudio.play();
  }, 4500);

  startGame();

  cards.forEach(card => {
    randomPos = Math.trunc(Math.random() * 12);
    card.style.order = randomPos;
  });
  interval = setInterval(startTimer, 1000);
})();

/******** Moves Count ********/
function countMoves() {
  movesCount++;
  movesDisplay.textContent = movesCount;
}

// Event listener for overlay click to close modal
overlay.addEventListener('click', closeModal);

// Restart button to reload the page
restartBtn.addEventListener('click', () => {
  location.reload();
});

// Keyboard event to close modal using Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Handle card click event
cards.forEach((card, index) => {
  card.addEventListener('click', function () {
    if (lockBoard) return;
    if (this === firstCard) return; // Prevent double-clicking the same card
    this.classList.add('flip');

    if (!hasFlippedCard) {
      // First click
      hasFlippedCard = true;
      firstCard = this;
      firstBackFace = backcards[index];
    } else {
      // Second click
      hasFlippedCard = false;
      secondCard = this;
      secondBackFace = backcards[index];
      checkForMatch();
    }

    countMoves();

    // If all cards are matched, display the modal
    if (correctMatches === 6) {
      setTimeout(() => {
        clearInterval(interval);
        musicAudio.pause();
        winAudio.play();
        openModal();
        correctMatches = 0;
      }, 900);
    }
  });
});
