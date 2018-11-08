//
// Blackjack
// by Ludo
//

// Card variables
let suits = ['\u2661', '\u2667', '\u2662', '\u2664'];
let values = ['Ace', 'King', 'Queen', 'Jack',
              '10', '9', '8', '7', '6',
              '5', '4', '3', '2'];

// DOM variables               
let textArea = document.getElementById('text-area'),
    cashArea = document.getElementById('cash-area'),
    newGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button');
    
// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    playerTied = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [],
    playerCounter = 0,
    dealerCounter = 0,
    bankAccount = 5000;

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  playerTied = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];
  
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
});

hitButton.addEventListener('click', function() {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click', function() {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});


function createDeck() {
    let deck = [];
    for(let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for(let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };
            deck.push(card);
        }
    }
    return deck;
}

function shuffleDeck(deck) {
  for(let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card) {
  return card.value +  ' of '  + card.suit;
}

function getNextCard() {
  return deck.shift();
}

function getCardNumericValue(card) {
  switch(card.value) {
    case 'Ace':
      return 1;
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    case '6':
      return 6;
    case '7':
      return 7;
    case '8':
      return 8;
    case '9':
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for(let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if(card.value === 'Ace') {
      hasAce = true;
    }
  }
  if(hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
    
    updateScores();

    if(gameOver) {
        // let dealer take cards
        while(dealerScore < playerScore
                && playerScore < 21
                && dealerScore < 21) {
            dealerCards.push(getNextCard());
            updateScores();
        }
    }

    if(playerScore > 21) {
        playerWon = false;
        gameOver = true;
    }
    else if(dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    }
    else if(playerScore === 21 && dealerScore === 21) {
        playerTied = true;
        gameOver = true;
    }
    else if(playerScore === 21) {
        playerWon = true;
        gameOver = true
    }
    else if(dealerScore === 21) {
        playerWon = false;
        gameOver = true
    }
    else if(gameOver) {
        
        if(playerScore > dealerScore) {
            playerWon = true;
        }
        else if(playerScore === dealerScore) {
            playerTied = true;
        }
        else {
            playerWon = false;
        }
    }
}

function showStatus() {
  if(!gameStarted) {
    textArea.innerText = 'Welcome to Blackjack!';
    return;
  }
  
  let dealerCardString = '';
  for(let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }
  
  let playerCardString = '';
  for(let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }
  
updateScores();

textArea.innerText =
  'Dealer has:\n\n' +
  dealerCardString +
  '(score: ' + dealerScore + ')\n\n' +
  
  'Player has: \n\n' +
  playerCardString +
  '(score: ' + playerScore + ')\n\n';
  
  if(gameOver) {
    if(playerWon) {
      textArea.innerText += "YOU WIN! + $1000 :)";
      playerCounter ++;
      bankAccount += 1000;
    } 
    else if(playerTied) {
        textArea.innerText += "IT'S A TIE";
    } else {
      textArea.innerText += "YOU LOST. - $1000 :(";
      dealerCounter ++;
      bankAccount += -1000;
    }
    textArea.innerText +=
    '\n\n' +
    'You won:\n ' + 
    playerCounter + 
    ' games\n';

    textArea.innerText +=
    'Dealer won:\n ' + 
    dealerCounter + 
    ' games\n';

    if(bankAccount >= 0) {
    cashArea.innerText =
    'Balance: ' +
    '$' + bankAccount;
    } else {
      cashArea.innerText =
      'You are bankrupt' +
      '\n reloading...';
      setTimeout(function() {window.location.reload(true)}, 1000);
    }
    if(bankAccount < 0) {
      newGameButton = 'none';
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}

function setPositionForgameInfo() {
  let gameContainer = document.getElementById('gameContainer');
  let gameContainerHeight = gameContainer.clientHeight;
  let gameContainerWidth = gameContainer.clientWidth;

  gameContainer.style.left = `calc(37% - ${gameContainerWidth/2}px)`;
  gameContainer.style.top = `calc(27% - ${gameContainerHeight/1.3}px)`;
  gameContainer.style.visibility = 'visible';
}
function setPositionForTitleInfo() {
  let titleContainer = document.getElementById('titleContainer');
  let titleContainerHeight = titleContainer.clientHeight;
  let titleContainerWidth = titleContainer.clientWidth;

  titleContainer.style.left = `calc(12% - ${titleContainerWidth/2}px)`;
  titleContainer.style.top = `calc(27% - ${titleContainerHeight/1.3}px)`;
  titleContainer.style.visibility = 'visible';
}
function setPositionForCashInfo() {
  let bankContainer = document.getElementById('bankContainer');
  let bankContainerHeight = bankContainer.clientHeight;
  let bankContainerWidth = bankContainer.clientWidth;

  bankContainer.style.left = `calc(11% - ${bankContainerWidth/2}px)`;
  bankContainer.style.top = `calc(50% - ${bankContainerHeight/1.3}px)`;
  bankContainer.style.visibility = 'visible';
}
setPositionForgameInfo();
setPositionForTitleInfo();
setPositionForCashInfo();
