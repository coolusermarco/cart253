/**
 * FRUIT SLASH
 * Slice fruits by clicking with the mouse
 * Lose a life when a fruit falls without being sliced
 *  Game over when lives reach 0 or timer ends
 */

"use strict";

let blueFruits = [];
let blueAppleImg;
let blueBananaImg;
let blueWatermelonImg;
let blueBombImg;
let blueBgImg;

let blueScore = 0;
let blueTimer = 60;
let blueLives = 3;
let blueLevel = 1;
let blueLevelTime = 60;
let blueMaxLevel = 3;
let blueHighScore = 0;
let blueGameState = "menu";

function bluePreload() {
  blueAppleImg      = loadImage("assets/images/apple.png");
  blueBananaImg     = loadImage("assets/images/banana.png");
  blueWatermelonImg = loadImage("assets/images/watermelon.png");
  blueBombImg       = loadImage("assets/images/bomb.png");
  blueBgImg         = loadImage("assets/images/fruitninja.png");
}

function blueSetup() {
  blueGameState = "menu";
  blueLevel = 1;
  blueLevelTime = 60;
  blueScore = 0;
  blueInitGame();
}

function blueDraw() {
  if (blueBgImg) {
    imageMode(CORNER);
    image(blueBgImg, 0, 0, width, height);
    imageMode(CENTER);
  } else {
    background("#223344");
  }

  if (blueGameState === "menu") {
    blueDrawMenuScreen();
  }
  else if (blueGameState === "play") {
    blueMaybeSpawnFruit();
    blueMoveFruits();
    blueCheckSlices();

    blueDrawFruits();
    blueUpdateTimers();
    blueDisplayUI();

    if (blueTimer <= 0 || blueLives <= 0) {
      if (blueScore > blueHighScore) blueHighScore = blueScore;
      blueGameState = "gameover";
    }
  }
  else if (blueGameState === "gameover") {
    blueDrawGameOverScreen();
  }
}

function blueMousePressed() {
  if (blueGameState === "menu" || blueGameState === "gameover") {
    if (blueLevel < blueMaxLevel) {
      blueLevel++;
      blueLevelTime = max(20, blueLevelTime - 10);
    } else {
      blueLevel = 1;
      blueLevelTime = 60;
    }

    blueInitGame();
    blueGameState = "play";
    return;
  }
}

function blueKeyPressed(event) {
}

function blueDrawMenuScreen() {
  fill(0, 150);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("FRUIT SLASH", width / 2, height / 2 - 80);

  textSize(18);
  text("Move your mouse and hold click to slice fruits", width / 2, height / 2 - 20);
  text("Don't let fruits fall without slicing them", width / 2, height / 2 + 10);
  text("Lose a life when a fruit hits the ground", width / 2, height / 2 + 40);

  fill("#ffdd00");
  textSize(22);
  text("Click to start!", width / 2, height / 2 + 110);
}

function blueDrawGameOverScreen() {
  fill(0, 150);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  if (blueLives <= 0)
    text("GAME OVER", width / 2, height / 2 - 80);
  else
    text("TIME UP!", width / 2, height / 2 - 80);

  textSize(28);
  text(`Score: ${blueScore}`, width / 2, height / 2 - 20);
  text(`High Score: ${blueHighScore}`, width / 2, height / 2 + 20);
  text(`Level: ${blueLevel}`, width / 2, height / 2 + 60);

  fill("#ffdd00");
  textSize(22);
  text("Click to play again", width / 2, height / 2 + 110);
}

function blueInitGame() {
  blueFruits = [];
  blueTimer = blueLevelTime;
  blueLives = 3;
  blueScore = 0;
}

function blueMaybeSpawnFruit() {
  if (random() < 0.03) {
    blueSpawnFruit();
  }
}

function blueSpawnFruit() {
  let type = "fruit";
  let r = random();
  if (r > 0.8) type = "bomb";

  let fruitType = floor(random(3)); 

  let f = {
    x: random(width * 0.1, width * 0.9),
    y: height + 40,
    vx: random(-2, 2),
    vy: random(-13, -9),
    size: random(40, 60),
    type: type,
    fruitType: fruitType,
    sliced: false
  };

  blueFruits.push(f);
}

function blueMoveFruits() {
  let gravity = 0.4;

  for (let f of blueFruits) {
    f.vy += gravity;
    f.x += f.vx;
    f.y += f.vy;
  }

  let remaining = [];
  for (let f of blueFruits) {
    if (f.y > height + 80) {
      if (!f.sliced && f.type === "fruit") {
        blueLives--;
      }
    } else {
      remaining.push(f);
    }
  }
  blueFruits = remaining;
}

function blueDrawFruits() {
  for (let f of blueFruits) {
    let img = null;

    if (f.type === "bomb") {
      img = blueBombImg;
    } else {
      if (f.fruitType === 0) img = blueAppleImg;
      else if (f.fruitType === 1) img = blueBananaImg;
      else if (f.fruitType === 2) img = blueWatermelonImg;
    }

    if (img) {
      image(img, f.x, f.y, f.size, f.size);
    } else {
      noStroke();
      fill(f.type === "bomb" ? "#ff4444" : "#55ff55");
      ellipse(f.x, f.y, f.size);
    }

    if (f.sliced) {
      stroke(255, 0, 0);
      strokeWeight(2);
      line(f.x - 10, f.y - 10, f.x + 10, f.y + 10);
      line(f.x - 10, f.y + 10, f.x + 10, f.y - 10);
    }
  }
}

function blueCheckSlices() {
  if (!mouseIsPressed) return;

  for (let f of blueFruits) {
    if (f.sliced) continue;

    let d = dist(mouseX, mouseY, f.x, f.y);
    if (d < f.size / 2) {
      f.sliced = true;

      if (f.type === "bomb") {
        blueScore -= 5;
        blueLives--;
      } else {
        blueScore += 1;
      }

      if (blueScore < 0) blueScore = 0;
      if (blueLives < 0) blueLives = 0;
    }
  }
}

function blueUpdateTimers() {
  if (frameCount % 60 === 0 && blueTimer > 0) blueTimer--;
}

function blueDisplayUI() {
  push();
  fill(255);
  textSize(20);

  text(`Score: ${blueScore}`, 80, 30);
  text(`Time: ${blueTimer}`, 80, 55);
  text(`Lives: ${blueLives}`, 80, 80);
  text(`Level: ${blueLevel}`, 80, 105);

  pop();
}
