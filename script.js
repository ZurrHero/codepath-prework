//global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const buttons = document.querySelectorAll('button1, button2, button3, button4, button5');
                                          
//Global variables
var pattern = [2, 2, 4, 3, 5, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var volume = 0.5; //must be between 0.0 and 1.0
var strikes;
var guessCounter = 0; //progress of where user is in guessint pattern sequence

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("endBtn").classList.remove("hidden");
    //document.getElementById("turnLabel").classList.add("hidden");
    //document.getElementById("myTurnLabel").classList.remove("hidden");
    //document.getElementById("yourTurnLabel").classList.add("hidden");
    pattern = randomizePattern(pattern);
    strikes = 0;
    document.getElementById("strikesLabel").innerHTML = "Strikes: " + strikes + " of 3.";
    document.getElementById("gameResetNotification").classList.add("hidden");
    playClueSequence();
}
function endGame(){
  gamePlaying = false;
  document.getElementById("endBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
  //document.getElementById("turnLabel").classList.remove("hidden");
  //document.getElementById("myTurnLabel").classList.add("hidden");
  /*setTimeout(() => {
    strikes = 0;
    document.getElementById("strikesLabel").innerHTML = "Strikes: " + strikes + " of 3.";}, 60000);*/
  buttons.disabled = true;
}

function randomizePattern(pattern){
  for(let i = 0; i <= pattern.length - 1; i++){
    var randomNum = Math.random() * 5;
    pattern[i] = Math.floor(randomNum) + 1;
  }
  return pattern;
}

function lightButton(btn){
  document.getElementById("button" + btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button" + btn).classList.remove("lit")
}
function playSingleClue(btn){
  //console.log("whose turn is it? 1");
  if(gamePlaying){
    //console.log("whose turn is it? 2");
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
    //console.log("whose turn is it? 3");
  }
  //console.log("whose turn is it? 4 Your turn shown.");
  //document.getElementById("myTurnLabel").classList.add("hidden");
  //document.getElementById("yourTurnLabel").classList.remove("hidden");
}
function playClueSequence() {
  buttons.disabled = true;
  //document.getElementById("myTurnLabel").classList.remove("hidden");
  //document.getElementById("yourTurnLabel").classList.add("hidden");
  //console.log("whose turn is it? 5 My turn shown.");
  
  console.log("progress: " + progress);
  console.log("cht: " + clueHoldTime);
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i = 0; i <= progress; i++){ //for each clue that is revealed so far
    //console.log("whose turn is it? 6");
    clueHoldTime = 1000 - (progress * 100);
    console.log("progress: " + progress);
    console.log("cht: " + clueHoldTime);
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue, delay, pattern[i]) //set a timeout to play that clue
    delay += clueHoldTime
    delay += cluePauseTime;
    //console.log("whose turn is it? 7");
  }
  //console.log("whose turn is it? 7.5");
  buttons.disabled = false;
}
function loseGame(){
  endGame();
  alert("Game Over. You lost.");
}
function winGame(){
  endGame();
  alert("Game Over. You won!")
}
function guess(btn){
  //console.log("whose turn is it? 8");
  //console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    //console.log("whose turn is it? 9");
    return;
  }
  
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    //console.log("whose turn is it? 10");
    if(guessCounter == progress){
      //console.log("whose turn is it? 11");
      if(progress == pattern.length - 1){
        //console.log("whose turn is it? 12");
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    loseGame();
    /*if(strikes == 2){
      document.getElementById("strikesLabel").innerHTML = "Strike " + strikes + " of 3";
      loseGame();
      //Guess was incorrect
      //GAME OVER: LOSE!
    }else{
      strikes += 1;
      document.getElementById("strikesLabel").innerHTML = "Strike " + strikes + " of 3";
      //console.log("strike: " + strikes);
      playClueSequence();
    }*/
  }
} 

///////////////////////////////////////////////////////////////////////

// Sound Synthesis Functions
const freqMap = {
  1: 240,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 530
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)