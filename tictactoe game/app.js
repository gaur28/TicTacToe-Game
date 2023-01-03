//Game Data
let gameData = [
    ['0', '0', '0'],
    ['0', '0', '0'],
    ['0', '0', '0']
];

let activePlayer = 0;
let editedPlayer= 0;
let currentRound= 1;
let gameIsOver = false;

const players = [
    {
        name: '',
        symbol: 'X'
    },
    {
        name : '',
        symbol: 'O',
    }

];


//connections with index page

let playerConfigOverlay = document.getElementById('config-overlay');
let backdropElement = document.getElementById('drawback');
const formElement = document.querySelector('form');
const errorOutputElement = document.getElementById('config-error');
const gameAreaElement = document.getElementById('active-game');
const activePlayerNameElement = document.getElementById('active-player-name');
const gameOverElement = document.getElementById('game-over');

const editPlayer1button = document.getElementById('edit-player-1-btn');
const editPlayer2button = document.getElementById('edit-player-2-btn');
const cancelConfigBtnElement= document.getElementById('cancel-config-btn');
const startNewGame = document.getElementById('start-new-game');
const gameBoardElement = document.getElementById('game-board');
const gameFieldElements = document.querySelectorAll('#game-board li');

//function for the event listner

function openPlayerConfig(event){
    editedPlayer = +event.target.dataset.playerid;
     
     
     playerConfigOverlay.style.display = 'block';
     backdropElement.style.display= 'block';
 }
 function closePlayerconfig(){
     playerConfigOverlay.style.display= 'none';
     backdropElement.style.display= 'none';
     formElement.firstElementChild.classList.remove('error');
     errorOutputElement.textContent = '';
     formElement.firstElementChild.lastElementChild.value = '';
 }
 
 function savePlayerConfig(event){
     event.preventDefault();
     const formData= new FormData(event.target);
     const enteredPlayerData = formData.get('player-name').trim();
 
     if(!enteredPlayerData ){
         event.target.firstElementChild.classList.add('error');
         errorOutputElement.textContent = 'please enter valid name';
         return;
     }
 
     const updatedPlayerElement= document.getElementById('player-' + editedPlayer + '-data');
     updatedPlayerElement.children[1].textContent = enteredPlayerData;
 
     players[editedPlayer-1].name = enteredPlayerData;
 
     closePlayerconfig();
 }

// add Event Listner to Function
 editPlayer1button.addEventListener('click',openPlayerConfig);
 editPlayer2button.addEventListener('click', openPlayerConfig);
cancelConfigBtnElement.addEventListener('click', closePlayerconfig);

formElement.addEventListener('submit', savePlayerConfig);
 startNewGame.addEventListener('click', startGame);

 for(const gameFieldElement of gameFieldElements){
     gameFieldElement.addEventListener('click',selectGameField);
 }


//game logic for the game

function ResetGameStatus() {
    activePlayer = 0;
    currentRound = 1;
    gameIsOver = false;
    gameOverElement.firstElementChild.innerHTML =
      'You won, <span id="winner-name">Player Name</span>!';
    gameOverElement.style.display = "none";
  
    let gameBoardIndex = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        gameData[i][j] = 0;
        const gameBoardItemElement = gameBoardElement.children[gameBoardIndex];
        gameBoardItemElement.textContent = "";
        gameBoardIndex++;
        gameBoardItemElement.classList.remove("disabled");
      }
    }
  }
  
  function startGame() {
    if (players[0].name === "" || players[1].name === "") {
      alert("Please set valid custom name for Players!");
      return;
    }
  
    ResetGameStatus();
  
    activePlayerNameElement.textContent = players[activePlayer].name;
  
    gameAreaElement.style.display = "block";
  }
  
  function switchPlayer() {
    if (activePlayer === 0) {
      activePlayer = 1;
    } else {
      activePlayer = 0;
    }
    activePlayerNameElement.textContent = players[activePlayer].name;
  }
  
  function selectGameField(event) {
    if (event.target.tagName !== "LI" || gameIsOver) {
      return;
    }
  
    const selectedFeild = event.target;
  
    const selectedcolumn = selectedFeild.dataset.col - 1;
    // console.log(selectedcolumn); no bug here.
    const selectedRow = selectedFeild.dataset.row - 1;
    // console.log(selectedRow); no bug here.
  
    if (gameData[selectedRow][selectedcolumn] > 0) {
      alert("please select valid feild");
      return;
    }
  
    selectedFeild.textContent = players[activePlayer].symbol;
    //console.log(selectedFeild) no bugs here.
    selectedFeild.classList.add("disabled");
  
    gameData[selectedRow][selectedcolumn] = activePlayer + 1;
    //console.log(gameData);
  
    let winnerId = checkForGameOver();
    if (winnerId !== 0) {
      endGame(winnerId);
    }
  
    currentRound++;
    switchPlayer();
  }
  
  function checkForGameOver() {
    // checking the rows for equality.
    //  for(let i=0; i<3; i++){
    //  if (
    //      gameData[i][0]>0 &&
    //       gameData[i][0]=== gameData[i][1] &&
    //        gameData[i][1]===gameData[i][2]
    //      )   {
    //              return gameData[i][0];
    //          }
    //       // console.log(i)
    //          //console.log(gameData[i][0]);
  
    //  }
 
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          gameData[i][0] > 0 &&
          gameData[i][0] === gameData[i][1] &&
          gameData[i][1] === gameData[i][2]
        ) {
          return gameData[i][0];
        }
  
        if (
          gameData[0][j] > 0 &&
          gameData[0][j] === gameData[1][j] &&
          gameData[0][j] === gameData[2][j]
        ) {
          return gameData[0][j];
        }
  
        if (
          gameData[0][0] > 0 &&
          gameData[0][0] === gameData[1][1] &&
          gameData[1][1] === gameData[2][2]
        ) {
          return gameData[0][0];
        }
        if (
          gameData[2][0] > 0 &&
          gameData[2][0] === gameData[1][1] &&
          gameData[1][1] === gameData[0][2]
        ) {
          return gameData[2][0];
        }
  
        if (currentRound === 9) {
          return -1;
        }
      }
    }
    return 0;
  }
  
  function endGame(winnerId) {
    gameIsOver = true;
    gameOverElement.style.display = "block";
  
    if (winnerId > 0) {
      const winnerName = players[winnerId - 1].name;
      gameOverElement.firstElementChild.firstElementChild.textContent =
        winnerName;
    } else {
      gameOverElement.firstElementChild.textContent = "it's a draw!";
    }
  }
  