/**
 * ALIEN LASER
    UFO at the top of the screen
     Shoots down at creatures
    avoid the missiles thrown at u
     ufo has 3 HP, game over after 3 hits
   Uses images for background, octopus, and creatures
 */

"use strict";

// UFO
const greenUfo = {
  body: { x: 320, y: 100, size: 140 },

  bubble: {
    x: undefined,
    y: 120,
    size: 20,
    speed: 10,
    state: "idle"
  },

  color: "#ff66aa",
  eyes: { size: 20, pupilSize: 10 },

  hp: 3
};
let greenStarImg;
let greenShellImg;
let greenJellyImg;
let greenBgImg;
let greenUfoImg;

let greenCreatures = [];
let greenEnemyBullets = [];
let greenScore = 0;
let greenTimer = 60;
let greenBubbleCooldown = 0;
let greenLevel = 1;
let greenLevelTime = 60;
let greenMaxLevel = 3;
let greenHighScore = 0;
let greenGameState = "menu";

function greenPreload() {
  greenStarImg  = loadImage("assets/images/alien.png");
  greenShellImg = loadImage("assets/images/spaceship.png");
  greenJellyImg = loadImage("assets/images/alien2.png");
  greenBgImg    = loadImage("assets/images/planet.png");
  greenUfoImg   = loadImage("assets/images/ufo.png");
}

function greenSetup() {
  greenGameState = "menu";
  greenLevel     = 1;
  greenLevelTime = 60;
  greenScore     = 0;
  greenInitGame();
}

function greenDraw() {
  if (greenBgImg) {
    imageMode(CORNER);
    image(greenBgImg, 0, 0, width, height);
    imageMode(CENTER);
  } else {
    background("#003355");
    greenDrawSeaFloor();
  }

  if (greenGameState === "menu") {
    greenDrawMenuScreen();
  }
  else if (greenGameState === "play") {
    greenMoveCreatures();
    greenMoveEnemyBullets();
    greenMoveUfo();
    greenMoveBubble();

    greenDrawCreatures();
    greenDrawEnemyBullets();
    greenDrawUfo();
    greenDrawBubble();

    greenCheckBubbleCreaturesOverlap();
    greenCheckEnemyBulletsHitUfo();

    greenUpdateTimers();
    greenDisplayUI();

    if (greenTimer <= 0) {
      if (greenScore > greenHighScore) greenHighScore = greenScore;
      greenGameState = "gameover";
    }
  }
  else if (greenGameState === "gameover") {
    greenDrawGameOverScreen();
  }
}

function greenMousePressed() {
  if (greenGameState === "menu" || greenGameState === "gameover") {
    if (greenLevel < greenMaxLevel) {
      greenLevel++;
      greenLevelTime = max(20, greenLevelTime - 10);
    } else {
      greenLevel = 1;
      greenLevelTime = 60;
      greenScore = 0;
    }

    greenInitGame();
    greenGameState = "play";
    return;
  }

  if (greenUfo.bubble.state === "idle" && greenBubbleCooldown <= 0) {
    greenUfo.bubble.state = "outbound";
    greenBubbleCooldown = 20;
  }
}

function greenKeyPressed(event) {
}

function greenDrawSeaFloor() {
  push();
  fill("#332200");
  rect(0, height - 60, width, 60);
  pop();
}

function greenDrawMenuScreen() {
  fill(255, 50);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("ALIEN LASER", width / 2, height / 2 - 80);

  textSize(18);
  text("Move the UFO with your mouse", width / 2, height / 2 - 20);
  text("Click to shoot missiles downward", width / 2, height / 2 + 10);
  text("Hit the spaceships for points", width / 2, height / 2 + 40);
  text("Avoid spaceship bullets from the crafts", width / 2, height / 2 + 70);

  fill("#ffdd00");
  textSize(22);
  text("Click to start!", width / 2, height / 2 + 120);
}

function greenDrawGameOverScreen() {
  fill(255, 80);
  rect(0, 0, width, height);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(48);

  if (greenLevel >= greenMaxLevel)
    text("FINAL GAME OVER", width / 2, height / 2 - 80);
  else
    text("LEVEL COMPLETE", width / 2, height / 2 - 80);

  textSize(28);
  text(`Score: ${greenScore}`, width / 2, height / 2 - 20);
  text(`High Score: ${greenHighScore}`, width / 2, height / 2 + 20);
  text(`Level: ${greenLevel}`, width / 2, height / 2 + 60);

  fill("#ffdd00");
  textSize(22);
  text("Click to continue!", width / 2, height / 2 + 110);
}

function greenInitGame() {
  greenInitCreatures();
  greenEnemyBullets = [];
  greenTimer = greenLevelTime;
  greenUfo.hp = 3;
}

function greenInitCreatures() {
  greenCreatures = [];

  for (let i = 0; i < 6; i++) {
    let r = random();
    let type = "shell";

    if (r < 0.2) type = "jelly";
    else if (r < 0.5) type = "star";

    greenCreatures.push({
      x: random(width),
      y: random(300, height - 60),
      size: random(15, 22),
      speed: random(1.5, 3),
      type
    });
  }
}

function greenMoveCreatures() {
  for (let c of greenCreatures) {
    c.x += c.speed;
    c.y += sin(frameCount * 0.03) * 0.5;

    if (c.x > width) {
      c.x = 0;
      c.y = random(300, height - 60);
    }

    if (c.type === "jelly") {
      if (random() < 0.01) {
        greenEnemyBullets.push({
          x: c.x,
          y: c.y,
          size: 8,
          speed: 5
        });
      }
    }
  }
}

function greenDrawCreatures() {
  for (let c of greenCreatures) {
    let img = null;

    if (c.type === "star")       img = greenStarImg;
    else if (c.type === "jelly") img = greenJellyImg;
    else if (c.type === "shell") img = greenShellImg;

    if (img) {
      const w = c.size * 2;
      const h = c.size * 2;
      image(img, c.x, c.y, w, h);
    } else {
      noStroke();
      if (c.type === "star") fill("#ffcc00");
      else if (c.type === "jelly") fill("#ff5555");
      else fill("#eeeeee");
      ellipse(c.x, c.y, c.size);
    }
  }
}

function greenMoveEnemyBullets() {
  for (let b of greenEnemyBullets) {
    b.y -= b.speed;
  }
  greenEnemyBullets = greenEnemyBullets.filter(b => b.y > -20);
}

function greenDrawEnemyBullets() {
  push();
  noStroke();
  fill("#ff4444");
  for (let b of greenEnemyBullets) {
    ellipse(b.x, b.y, b.size);
  }
  pop();
}

function greenCheckEnemyBulletsHitUfo() {
  let remaining = [];

  for (let b of greenEnemyBullets) {
    let d = dist(b.x, b.y, greenUfo.body.x, greenUfo.body.y);
    if (d < greenUfo.body.size / 2) {
      greenUfo.hp--;

      if (greenUfo.hp <= 0) {
        greenGameState = "gameover";
        return;
      }
    } else {
      remaining.push(b);
    }
  }

  greenEnemyBullets = remaining;
}

function greenMoveUfo() {
  greenUfo.body.x = mouseX;
}

function greenMoveBubble() {
  greenUfo.bubble.x = greenUfo.body.x;

  if (greenUfo.bubble.state === "idle") {
    greenUfo.bubble.y = greenUfo.body.y + 20;
    return;
  }

  if (greenUfo.bubble.state === "outbound") {
    greenUfo.bubble.y += greenUfo.bubble.speed;

    if (greenUfo.bubble.y >= height) {
      greenUfo.bubble.state = "idle";
      greenUfo.bubble.y = greenUfo.body.y + 20;
    }
  }
}

function greenDrawBubble() {
  if (greenUfo.bubble.state !== "idle") {
    fill("#88ccff");
    noStroke();
    ellipse(greenUfo.bubble.x, greenUfo.bubble.y, greenUfo.bubble.size);
  }
}

function greenDrawUfo() {
  if (greenUfoImg) {
    const w = greenUfo.body.size * 1.2;
    const h = greenUfo.body.size * 1.2;
    image(greenUfoImg, greenUfo.body.x, greenUfo.body.y, w, h);
  } else {
    fill(greenUfo.color);
    noStroke();
    ellipse(greenUfo.body.x, greenUfo.body.y, greenUfo.body.size);
    greenDrawEyes();
  }
}

function greenDrawEyes() {
  let eyeOffset = 25;
  let eyeY = greenUfo.body.y - 40;

  fill(255);
  ellipse(greenUfo.body.x - eyeOffset, eyeY, 20);
  ellipse(greenUfo.body.x + eyeOffset, eyeY, 20);

  fill(0);
  ellipse(greenUfo.body.x - eyeOffset + 3, eyeY, 8);
  ellipse(greenUfo.body.x + eyeOffset - 3, eyeY, 8);
}

function greenCheckBubbleCreaturesOverlap() {
  if (greenUfo.bubble.state === "idle") return;

  for (let c of greenCreatures) {
    let d = dist(greenUfo.bubble.x, greenUfo.bubble.y, c.x, c.y);
    if (d < greenUfo.bubble.size / 2 + c.size / 2) {
      greenHandleCreatureCatch(c);
      c.x = random(width);
      c.y = random(300, height - 60);
    }
  }
}

function greenHandleCreatureCatch(c) {
  if (c.type === "star") greenScore += 3;
  else if (c.type === "shell") greenScore++;
  else if (c.type === "jelly") greenScore -= 2;

  if (greenScore < 0) greenScore = 0;

  greenUfo.bubble.state = "idle";
}

function greenUpdateTimers() {
  if (frameCount % 60 === 0 && greenTimer > 0) greenTimer--;
  if (greenBubbleCooldown > 0) greenBubbleCooldown--;
}

function greenDisplayUI() {
  push();
  fill(255);
  textSize(20);

  text(`Score: ${greenScore}`, 50, 20);
  text(`Time: ${greenTimer}`, 50, 40);
  text(`Level: ${greenLevel}`, 50, 60);
  text(`HP: ${greenUfo.hp}`, 50, 80);

  if (greenBubbleCooldown > 0)
    text("Cooldown...", 50, 100);

  pop();
}
