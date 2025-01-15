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
let startingMinutes = 1; // Starting time in minutes
let time; // Time in seconds (initialized later)
let interval;
let correctMatches = 0;

const startAudio = new Audio('audio/audiostart.mp3');
const matchAudio = new Audio('audio/match.mp3');
const loseAudio = new Audio('audio/lose.mp3');
const winAudio = new Audio('audio/winn.mp3');
const musicAudio = new Audio('audio/music.mp3');

/******** Functions ********/

// Starts the game with flipped cards animation and initializes the timer
function startGame() {
  // Reset time and moves when the game starts
  time = startingMinutes * 60; // Initialize the timer correctly
  movesCount = 0;
  movesDisplay.textContent = movesCount; // Reset moves display

  cards.forEach(card => {
    card.classList.add('flip');
  });

  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('flip');
    });
  }, 1000);

  interval = setInterval(startTimer, 1000); // Start the timer when the game begins
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
  clearInterval(interval); // Clear the timer
  location.reload();
};

// Start the countdown timer
function startTimer(){

    const minutes= Math.floor(time / 60);
    let seconds = time % 60;
    seconds= seconds<10 ?'0'+seconds : seconds;
    let timeover=`${minutes}:${seconds}`;
    countdown.innerHTML=timeover
    time--;
    
    if(timeover==='0:00'){
        musicAudio.pause();
        loseAudio.play();
       gameOverModel.classList.remove('visibilty');
       overly.classList.remove('visibilty'); 
       clearInterval(interval);
       correct=0;
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

      // If all cards are matched, end the game
      if (correctMatches === 6) {
        setTimeout(() => {
          clearInterval(interval);
          musicAudio.pause();
          winAudio.play();
          openModal();
          correctMatches = 0;
        }, 900);
      }
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

  cards.forEach(card => {
    randomPos = Math.trunc(Math.random() * 12);
    card.style.order = randomPos;
  });

  startGame(); // Start the game after shuffling
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
  clearInterval(interval); // Clear the timer before restarting
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
  });
});