// Touch handling for mobile
var touchStartX = 0;
var touchStartY = 0;
var touchEndX = 0;
var touchEndY = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
}

function handleSwipe() {
    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;
    var minSwipeDistance = 30; // Minimum distance for a swipe
    
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        return; // Not a swipe, ignore
    }
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && lastDir != "a") {
            nextDir = "d"; // Swipe right
        } else if (deltaX < 0 && lastDir != "d") {
            nextDir = "a"; // Swipe left
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && lastDir != "w") {
            nextDir = "s"; // Swipe down
        } else if (deltaY < 0 && lastDir != "s") {
            nextDir = "w"; // Swipe up
        }
    }
    
    if (isInPlay) {
        setHeadFacing(document.querySelector(".gamearea div[row=\"" + newsnake[0][0] + "\"][col=\"" + newsnake[0][1] + "\"]"), nextDir);
    }
}

// Define Functions

function setRowColVals(abox,i) {
    var row = Math.floor(i/COLUMNS);
    var col = i - COLUMNS*row
    abox.setAttribute("row",row);
    abox.setAttribute("col",col);
}

function getABox(row,col) {
    var box = document.querySelector(".gamearea div[row=\"" + row + "\"][col=\"" + col + "\"]");
    return box;
}
function getCoord(box) {
    var coordinates = [parseInt(box.getAttribute("row")),parseInt(box.getAttribute("col"))];
    return coordinates;
}

function changeDirection(key) {
    if ((key.keyCode==87 || key.keyCode==119) && lastDir!="s") {
        nextDir = "w";
    } else if ((key.keyCode==65 || key.keyCode==97) && lastDir!="d") {
        nextDir = "a";
    } else if ((key.keyCode==83 || key.keyCode==115) && lastDir!="w") {
        nextDir = "s";
    } else if ((key.keyCode==68 || key.keyCode==100) && lastDir!="a") {
        nextDir = "d";
    }
    setHeadFacing(document.querySelector(".gamearea div[row=\"" + newsnake[0][0] + "\"][col=\"" + newsnake[0][1] + "\"]"),nextDir);
}

function makeOpenSpace(box) {
    console.log(box);
    box.setAttribute("class","openspace");
}
function makeSnakeBody(box) {
    box.setAttribute("class","snakebody");
}
function setHeadFacing(box,dir) {
    if (dir=="a") {
        box.setAttribute("style","border-radius: 50% 0 0 50%");
    } else if (dir=="s") {
        box.setAttribute("style","border-radius: 0 0 50% 50%");
    } else if (dir=="d") {
        box.setAttribute("style","border-radius: 0 50% 50% 0");
    } else if (dir=="w") {
        box.setAttribute("style","border-radius: 50% 50% 0 0");
    }
}
function makeSnakeHead(box) {
    box.setAttribute("class","snakehead");
    setHeadFacing(box,nextDir);
}
function getOldSnake() {
    if (firstround) {
        var oldhead = getCoord(document.querySelector(".gamearea .snakehead"));
        var oldbod = getCoord(document.querySelector(".gamearea .snakebody"));
        var snake = []; 
        snake = [oldhead.slice(),oldbod.slice()];
        firstround = false;
        return snake.slice();
    } else {
        return newsnake.slice();
    }
}
function setBoxRed(row,col) {
    var box = getABox(row,col);
    box.setAttribute("style","background-color:#BF4E30");
}
function setBoxOpen(row,col) {
    var box = getABox(row,col);
    box.removeAttribute("style");
}

function checkApple() {
    // Check if the snake head is at the apple position
    if (newsnake[0][0] == appleRow && newsnake[0][1] == appleCol) {
        return true;
    } else {
        return false;
    }
}

function placeApple() {
    // Remove previous apple if it exists
    if (appleRow >= 0 && appleCol >= 0) {
        var oldApple = getABox(appleRow, appleCol);
        if (oldApple && oldApple.getAttribute("class") == "apple") {
            makeOpenSpace(oldApple);
        }
    }
    
    // Find a random empty spot for the apple
    var emptySpots = [];
    for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLUMNS; c++) {
            var box = getABox(r, c);
            if (box && box.getAttribute("class") == "openspace") {
                // Make sure it's not occupied by snake
                var isSnakePos = false;
                for (var s = 0; s < newsnake.length; s++) {
                    if (newsnake[s][0] == r && newsnake[s][1] == c) {
                        isSnakePos = true;
                        break;
                    }
                }
                if (!isSnakePos) {
                    emptySpots.push([r, c]);
                }
            }
        }
    }
    
    if (emptySpots.length > 0) {
        var randomIndex = Math.floor(Math.random() * emptySpots.length);
        appleRow = emptySpots[randomIndex][0];
        appleCol = emptySpots[randomIndex][1];
        var appleBox = getABox(appleRow, appleCol);
        appleBox.setAttribute("class", "apple");
    }
}
function checkOOB() {
    if (newsnake[0][0]<0 || newsnake[0][0]>=ROWS || newsnake[0][1]<0 || newsnake[0][1]>=COLUMNS) {
        return true;
    } else {return false;}
}
function checkSS() {
    var i;
    for (i=1 ; i<newsnake.length ; ++i) {
        if (newsnake[0][0]==newsnake[i][0] && newsnake[0][1]==newsnake[i][1]) {
            return true;
        }
    }
    return false;
}
function countdown0() {
    setTimeout(function() {
        setBoxOpen(1,6);
        setBoxOpen(2,5);
        setBoxOpen(2,6);
        setBoxOpen(3,6);
        setBoxOpen(4,6);
        setBoxOpen(5,5);
        setBoxOpen(5,6);
        setBoxOpen(5,7);
        intLen = 1000 - difficulty*100;
        if (isInPlay) {interval = setInterval(intStep,intLen);}
    },1000);
}
function countdown1() {
    setTimeout(function() {
        setBoxRed(2,5);
        setBoxRed(2,6);
        setBoxRed(4,6);
        setBoxOpen(1,5);
        setBoxOpen(1,7);
        setBoxOpen(2,7);
        setBoxOpen(3,5);
        setBoxOpen(3,7);
        setBoxOpen(4,5);
        if (isInPlay) {countdown0();}
    },1000);
}
function countdown2() {
    setTimeout(function() {
        setBoxRed(4,5);
        setBoxOpen(4,7);
        if (isInPlay) {countdown1();}
    },1000);
}
function countdown3() {
    setTimeout(function() {
        setBoxRed(1,5);
        setBoxRed(1,6);
        setBoxRed(1,7);
        setBoxRed(2,7);
        setBoxRed(3,5);
        setBoxRed(3,6);
        setBoxRed(3,7);
        setBoxRed(4,7);
        setBoxRed(5,5);
        setBoxRed(5,6);
        setBoxRed(5,7);
        if (isInPlay) {countdown2();}
    },1000);
}
function updateScore() {
    var scoreText = "Points: " + points.toString().padStart(3, '0');
    SCORE.textContent = scoreText;
}
function gameStarter() {
    isInPlay=true;
    setTimeout(function() {
        if (isInPlay) {countdown3();}
    },500);
}
function gameOver() {
    console.log("Its here");
    clearInterval(interval);
    interval=null;
    var i,j;
    for ( i=0 ; i<COLUMNS ; ++i) {
        for (j=0 ; j<ROWS ; ++j) {
            setBoxRed(j,i);
        }
    }
}
function resetGame() {
    isInPlay=false;
    firstround = true;
    lastDir = "a";
    nextDir = "a";
    clearInterval(interval);
    interval=null;
    var i,j;
    for ( i=0 ; i<COLUMNS ; ++i) {
        for (j=0 ; j<ROWS ; ++j) {
            setBoxOpen(j,i);
            makeOpenSpace(getABox(j,i));
        }
    }
    var starthead = getABox(7,5);
    var startbody = getABox(7,6);
    makeSnakeHead(starthead);
    makeSnakeBody(startbody);
    points = 0;
    updateScore();
    appleRow = -1;
    appleCol = -1;
    placeApple();
}
function setDifficulty(btn) {
    if (difficulty==1) {
        DIFF1.removeAttribute("style");
    } else if (difficulty==2) {
        DIFF2.removeAttribute("style");
    } else if (difficulty==3) {
        DIFF3.removeAttribute("style");
    } else if (difficulty==4) {
        DIFF4.removeAttribute("style");
    } else if (difficulty==5) {
        DIFF5.removeAttribute("style");
    }
    if (btn==DIFF1) {
        difficulty=1;
    } else if (btn==DIFF2) {
        difficulty=2;
    } else if (btn==DIFF3) {
        difficulty=3;
    } else if (btn==DIFF4) {
        difficulty=4;
    } else if (btn==DIFF5) {
        difficulty=5;
    }
    btn.setAttribute("style","font-weight:bold; background-color:#393D3F; border-style:solid; border-width:2px; border-color:#FDFDFF");
}

function intStep() {
    let dir = nextDir;
    oldsnake = getOldSnake();
    newsnake = oldsnake.slice();
    if (dir=="a") {
        newsnake.splice(0,0,[parseInt(oldsnake[0][0],10),parseInt(oldsnake[0][1],10)-1]);
    } else if (dir=="s") {
        newsnake.splice(0,0,[parseInt(oldsnake[0][0],10)+1,parseInt(oldsnake[0][1],10)]);
    } else if (dir=="d") {
        newsnake.splice(0,0,[parseInt(oldsnake[0][0],10),parseInt(oldsnake[0][1],10)+1]);
    } else { // if (dir=="w")
        newsnake.splice(0,0,[parseInt(oldsnake[0][0],10)-1,parseInt(oldsnake[0][1],10)]);
    }
    var outofbounds = checkOOB();
    var snakesnake = checkSS();
    if (outofbounds || snakesnake) {
        gameOver();
        return;
    }
    
    var apple = checkApple();
    if (apple) {
        // Snake ate apple - increase score and place new apple
        points += 10;
        updateScore();
        placeApple();
    } else {
        // No apple eaten - remove tail
        var snakecopy = newsnake.splice(-1,1);
        makeOpenSpace(getABox(snakecopy[0][0],snakecopy[0][1]));
    }
    
    var bodycopy = newsnake.slice();
    var i; for (i=1 ; i<bodycopy.length ; ++i) {
        makeSnakeBody(getABox(bodycopy[i][0],bodycopy[i][1]));
        getABox(bodycopy[i][0],bodycopy[i][1]).removeAttribute("style");
    }
    var headcopy = newsnake.slice();
    makeSnakeHead(getABox(headcopy[0][0],headcopy[0][1]));
    lastDir = dir;
    
}
// Program 
/*  1. When click, count down from 3, 2, 1...
    2. WASD keys change "direction of motion" variable
    3. Each interval:
    
    !!! Actually need 2 direction values: last move, and current heading. Else it can get fucked up :(
    
        a. Ensure snake does not crash based on direction, area, and body
            -> else GAME OVER
        b. If direction of motion is into an apple
            -> Head moves, body extends
            -> Place new apple
            -> Update points, scoreboard
        c. Else update snake position array based on direction-of-motion
    4. Repeat 3 until (a) -> GAME OVER
    5. Anytime Reset is clicked, reset the entire game.
*/

// Define playable area
const COLUMNS = 12;
const ROWS = 10;
const RESET = document.querySelector(".resetbtn");
const SCORE = document.querySelector(".scoreboard");
const DIFF1 = document.querySelector(".diff1");
const DIFF2 = document.querySelector(".diff2");
const DIFF3 = document.querySelector(".diff3");
const DIFF4 = document.querySelector(".diff4");
const DIFF5 = document.querySelector(".diff5");
const playSpace = document.querySelectorAll(".gamearea div");

for ( i=0 ; i<playSpace.length ; ++i) {
    setRowColVals(playSpace[i],i);
}

// State Variables
var difficulty = 3;
var intLen;
setDifficulty(DIFF3);
var isInPlay = false;
var firstround = true;
var lastDir = "a";
var nextDir = "a";
var interval;
var points = 0;
var oldsnake = getOldSnake();
firstround = true;
var newsnake = oldsnake.slice();
var appleRow = -1;
var appleCol = -1;
var outofbounds = false;
var snakesnake = false;

// Event Listeners
window.addEventListener("keydown", function() {if (!isInPlay) {gameStarter();}});
window.addEventListener("keypress", function(key) {if (isInPlay) {changeDirection(key);}});
window.addEventListener("touchstart", function(event) {
    event.preventDefault();
    if (!isInPlay) {gameStarter();}
    handleTouchStart(event);
});
window.addEventListener("touchend", function(event) {
    event.preventDefault();
    if (isInPlay) {handleTouchEnd(event);}
});
RESET.addEventListener("click", function() {resetGame();});
DIFF1.addEventListener("click", function() {setDifficulty(DIFF1);});
DIFF2.addEventListener("click", function() {setDifficulty(DIFF2);});
DIFF3.addEventListener("click", function() {setDifficulty(DIFF3);});
DIFF4.addEventListener("click", function() {setDifficulty(DIFF4);});
DIFF5.addEventListener("click", function() {setDifficulty(DIFF5);});

// Initialize the game
resetGame();

