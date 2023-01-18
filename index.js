const container = document.querySelector(".container");
/*
The getBoundingClientRect() method returns the size of an element and its position relative to the viewport.

The getBoundingClientRect() method returns a DOMRect object with eight properties: left, top, right, bottom, x, y, width, height.
*/
let conDim = container.getBoundingClientRect();

//storing gameover page
const gameover = document.createElement("div");
gameover.textContent = "Click to Start Game";
gameover.style.position = "absolute";
gameover.style.color = "white";
gameover.style.lineHeight = "3.75rem";
gameover.style.height = "70vh";
gameover.style.textAlign = "center";
gameover.style.fontSize = "3rem";
gameover.style.textTransform = "uppercase";
gameover.style.backgroundColor = "blue";
gameover.style.width = "100%";
gameover.addEventListener("click", startGame);
container.appendChild(gameover);
// storing ball
const ball = document.createElement("div");
ball.style.position = "absolute";
ball.style.width = "1.25rem";
ball.style.height = "1.25rem";
ball.style.backgroundColor = "white";
ball.style.borderRadius = "1.55rem";
ball.style.backgroundImage = "url('ball.png')";
ball.style.backgroundSize = "1.25rem 1.25rem";
ball.style.top = "70%";
ball.style.left = "50%";
ball.style.display = "none";
container.appendChild(ball);
//storing paddle
const paddle = document.createElement("div");
paddle.className = "paddle";
paddle.style.position = "absolute";
paddle.style.backgroundColor = "white";
paddle.style.height = "2%";
paddle.style.width = "10%";
paddle.style.borderRadius = "1.56rem";
paddle.style.bottom = "1rem";
paddle.style.left = "50%";
container.appendChild(paddle);
//paddle on keydown
document.addEventListener("keydown", function (e) {
  // console.log(e.keyCode);
  if (e.keyCode === 37) paddle.left = true;
  if (e.keyCode === 39) paddle.right = true;
  if (e.keyCode === 38 && !player.inPlay) player.inPlay = true;
});

document.addEventListener("keyup", function (e) {
  // console.log(e.keyCode);
  if (e.keyCode === 37) paddle.left = false;
  if (e.keyCode === 39) paddle.right = false;
});

//Player defined
const player = {
  gameover: true,
  score: 0,
  lives: 0,
  inPlay: false,
  ball: [0, 0],
  num: 0,
  level: 1,
};

function startGame() {
  if (localStorage.getItem("highscore")) {
    player.highscore = JSON.parse(localStorage.getItem("highscore"));
  } else {
    player.highscore = 0;
  }
  if (player.gameover) {
    //restarting the game
    player.gameover = false;
    gameover.style.display = "none";
    player.score = 0;
    player.lives = 10;
    player.inPlay = false;
    ball.style.display = "block";
    // ball.style.left = (paddle.offsetLeft + 50)/16 + "rem"; //?
    // ball.style.top = (paddle.offsetTop - 30 )/16+ "rem"; //?
    player.ballDir = [2, -5];
    player.num = 100;
    scoreUpdater();
    setupBricks(player.num);

    player.ani = window.requestAnimationFrame(update);
  }
}

function setupBricks(num) {
  scoreUpdater();
  /*
  console.log(conDim);
  let start = (conDim.width - Math.floor(conDim.width / 6.25) * 6.25) / 2; //(empty space remaning on both sides)
  let row = {
    x: start,
    y: start,
  };
  let endvertical = ((conDim.height )/ 2)/16;
  let endhorizontal = conDim.width/16;

  console.log(start);
  console.log(endhorizontal);
  let endq = Math.floor(conDim.width / 6.25) - 1;
  let endp = Math.floor(conDim.height / 3.125) / 2 - 1;


  // console.log(endp);
  // console.log(endq);
  let lp = Math.floor(Math.random() * endp); //start to endp
  let lq = Math.floor(Math.random() * endq); //start to endq;//
  // console.log(lp);
  // console.log(lq);
  for (
    let vertical = start, p = 0;
    vertical < endvertical;
    vertical += 3.125, p++
  ) {
    for (
      let horizontal = start, q = 0;
      horizontal < endhorizontal;
      horizontal += 6.25, q++
    ) {
      row.count = num;
      row.x = horizontal;
      row.y = vertical;
      if ((p % 2 == 0 && q % 2 != 0) || (p % 2 != 0 && q % 2 == 0)) {
        if (p == lp && q == lq) {
          row.long = true;
          row.count = 1;
        } else {
          row.long = false;
          if (p + q == 5) {
            row.wall = true;
          } else {
            row.wall = false;
          }
        }
        createBrick(row);
        num--;
        if (num == 0) return;
      }
    }
  }

  */
//level ->
//walls->
//bricks
  let row = {
    x: 0,
    y: 0,
  };
  let endvertical = 15;
  let endhorizontal = 12;
  let lp = Math.floor(Math.random() * 15); //start to endp
  let lq = Math.floor(Math.random() * 12); //start to endq;//
  player.bricksRemaining=0;
  for (let p = 0;p <8; p++) {
    for (let q = 0;q<15;q++) {
      row.count = num;
      row.x = q;
      row.y = p;
      if (Math.random()<=Math.min(0.3+(player.level)/10,0.75)) {
        if (p == lp && q == lq) {
          row.long = true;
          row.count = 1;
          row.wall = false;
          player.bricksRemaining+=1;
        } else {
          row.long = false;
          if (Math.random()<=Math.min(0.2+(player.level)/10,0.4)) {
            row.wall = true;
          } else {
            row.wall = false;
            player.bricksRemaining+=1;
          }
        }
        createBrick(row);
        num--;
        if (num == 0) return;
      }
    }
  }


}

function createBrick(pos) {
  const div = document.createElement("div");
  div.setAttribute("class", "brick");

  if (pos.wall != true) div.style.backgroundColor = "red";
  else div.style.backgroundColor = "grey";
  div.style.border="solid black 0.01em" ;
  div.long = pos.long;
  div.wall = pos.wall;
  // div.textContent = pos.count + 1; 
  // div.innerText = "i="+pos.y +"j="+pos.x;;
  div.style.gridRowStart = (pos.y)+1;
  div.style.gridColumnStart = (pos.x)+1 ;
  // div.style.width = "4 px" ;
  container.appendChild(div);
  console.log(div);
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.right < bRect.left ||
    aRect.left > bRect.right ||
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom
  );
}

function rColor() {
  return "red";
}

function scoreUpdater() {
  document.querySelector(".score").textContent = player.score;
  document.querySelector(".lives").textContent = player.lives;
  if (player.score > player.highscore) {
    localStorage.setItem("highscore", JSON.stringify(player.score));
    player.highscore = player.score;
  }
  document.querySelector(".highscore").textContent = player.highscore;
  document.querySelector(".level").textContent = player.level;
}

function update() {
  if (!player.gameover) {
    let pCurrent = paddle.offsetLeft;
    if (paddle.left && pCurrent > 0) {
      pCurrent -= 5;
    }
    if (paddle.right && pCurrent < conDim.width - paddle.offsetWidth) {
      pCurrent += 5;
    }
    paddle.style.left = pCurrent + "px";
    if (!player.inPlay) {
      waitingOnPaddle();
    } else {
      moveBall();
    }
    player.ani = window.requestAnimationFrame(update);
  }
}

function waitingOnPaddle() {
  ball.style.top = paddle.offsetTop - 22 + "px";
  ball.style.left = paddle.offsetLeft + 40 + "px";
}

function fallOff() {
  paddle.style.width = "10rem";
  player.lives--;
  if (player.lives <= 0) {
    endGame();
    player.lives = 0;
  }
  scoreUpdater();
  stopper();
}

function endGame() {
  player.level = 1;
  gameover.style.display = "block";
  gameover.innerHTML =
    "Game Over<br>Your score " +
    player.score +
    "<br>High Score:" +
    player.highscore;
  player.gameover = true;
  ball.style.display = "none";
  let tempBricks = document.querySelectorAll(".brick");
  for (let tBrick of tempBricks) {
    tBrick.parentNode.removeChild(tBrick);
  }
  window.cancelAnimationFrame(player.ani);
}

function stopper() {
  player.inPlay = false;
  player.ballDir[(0, -5)];
  waitingOnPaddle();
  window.cancelAnimationFrame(player.ani);
}

function moveBall() {
  let posBall = {
    x: ball.offsetLeft,
    y: ball.offsetTop,
  };
  if (posBall.y > conDim.height - 20 || posBall.y < 0) {
    if (posBall.y > conDim.height - 20) {
      fallOff();
    } else {
      player.ballDir[1] *= -1;
    }
  }
  if (posBall.x > conDim.width - 20 || posBall.x < 0) {
    player.ballDir[0] *= -1;
  }
  if (isCollide(paddle, ball)) {
    let temp = (posBall.x - paddle.offsetLeft - paddle.offsetWidth / 2) / 10;
    console.log("hit");
    player.ballDir[0] = temp;
    player.ballDir[1] *= -1;
  }
  let bricks = document.querySelectorAll(".brick");
  if (player.bricksRemaining == 0 && !player.gameover) {
    player.level += 1;
    player.lives+=1;
    stopper();
    setupBricks(player.num);
  }
  // console.log(bricks);
  for (let tBrick of bricks) {
    if (isCollide(tBrick, ball)) {
      player.ballDir[1] *= -1;
      console.log(tBrick);
      // tBrick.textContent--;
      if (tBrick.style.backgroundColor == "red") {
        tBrick.style.backgroundColor = "brown";
        player.score++;
      } else {
        if (tBrick.wall == false) {
          player.score++;
          if (tBrick.long == true) {
            paddle.style.width = "20rem";
            // console.log("LONGG");
          }
          player.bricksRemaining-=1;
          tBrick.parentNode.removeChild(tBrick);
        }
      }
      // tBrick.display="hidden";
      
      scoreUpdater();
    }
  }
  posBall.y += player.ballDir[1];
  posBall.x += player.ballDir[0];
  ball.style.top = (posBall.y)/16 + "rem";
  ball.style.left = (posBall.x)/16 + "rem";
}
