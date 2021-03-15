/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// global constants
let clueHoldTime = 2000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const patternLength = 10;
const buttonCount = 6;
const maxWrongGuess = 3;
const maxWaitTime = 20;

// Global variables
var pattern = [];
var progress = 0;
var gamePlaying = false; 
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var wrongGuess = 0;
var timer;

function startGame(){
  // Initialize game variables
  progress = 0;
  wrongGuess = 0;
  gamePlaying = true;
  clueHoldTime = 1000;
  
  // Generate pattern
  pattern = [];
  for (let i = 0; i < patternLength; i++){
    pattern.push(Math.floor(Math.random() * buttonCount) + 1);
  }
  
  resetTime();
  startCountDown();
  
  // Swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence()
}

function stopGame(){
  // Initialize game variables
  gamePlaying = false;
  
  stopCountDown();
  
  // Swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 440.0,
  6: 880.0
}
function playTone(btn,len){ 
  playSoundtrack(btn);
  // o.frequency.value = freqMap[btn]
  // g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    playSoundtrack(btn);
    // o.frequency.value = freqMap[btn]
    // g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    // g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    stopSountrack()
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  
  // Reduce holdtime 100ms each turn
  if (clueHoldTime > 100){
    clueHoldTime -= 100;
  }
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function loseGame(){
  stopGame();
  stopCountDown();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  stopCountDown();
  alert("Game Over. You won.");
}

function resetTime(){
  document.getElementById("time").innerHTML = maxWaitTime;
}

function startCountDown(){
  timer = setInterval(function(){
    let timeDiv = document.getElementById("time");
    let time = Number(timeDiv.innerHTML);
    if (!time){
      loseGame();
    }
    else {
      timeDiv.innerHTML = `${time - 1}`;
    }
  }, 1000);
}

function stopCountDown(){
  if (timer){
    clearInterval(timer);
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  // add game logic here
  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        resetTime();
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    wrongGuess++;
    if (wrongGuess == maxWrongGuess){
      loseGame();
    }
    else {
      alert("Wrong, try again");
    }
  }
}

function playSoundtrack(id){
  document.getElementById(`audio${id}`).play();
}

function stopSountrack(){
  for (let i = 1; i < 7; i++){
    let audio = document.getElementById(`audio${i}`);
    audio.pause();
    audio.currentTime = 0;
  }
}