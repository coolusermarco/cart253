/** STARFISH SNATCHER, 
 using my frogfrogfrog mod jam code and ressources listed in readme.md, 
 i need to fix bugs and add more stuff like pngs and try to implement things i took notes of from my classmates' frogfrogfrog games
 */

"use strict";

// OCTOPUS
const redOctopus = {
  body: { x: 320, y: 420, size: 140 },

  bubble: {
    x: undefined,
    y: 400,
    size: 20,
    speed: 20,
    state: "idle"
  },

  color: "#ff66aa",
  eyes: { size: 20, pupilSize: 10 },
};

// IMAGES FOR CREATURES + BACKGROUND + OCTOPUS
let redStarImg;
let redShellImg;
let redJellyImg;
let redBgImg;
let redOctopusImg;

let redCreatures = [];
let redScore = 0;
let redTimer = 60;
let redBubbleCooldown = 0;
let redLevel = 1;
let redLevelTime = 60;
let redMaxLevel = 3;
let redHighScore = 0;
let redGameState = "menu";

function redPreload() {
  redStarImg    = loadImage("assets/images/star.png");
  redShellImg   = loadImage("assets/images/shell.png");
  redJellyImg   = loadImage("assets/images/jelly.png");
  redBgImg      = loadImage("assets/images/seafloor.png");
  redOctopusImg = loadImage("assets/images/octopus.png");
}

function redSetup() {
  redGameState = "menu";
  redLevel     = 1;
  redLevelTime = 60;
  redScore     = 0;
  redInitGame();
}

// DRAW
function redDraw() {
  if (redBgImg) {
    imageMode(CORNER);
    image(redBgImg, 0, 0, width, height);
    imageMode(CENTER);
  } else {
    background("#003355");
    redDrawSeaFloor();
  }

  if (redGameState === "menu") {
    redDrawMenuScreen();
  }
  else if (redGameState === "play") {
    redMoveCreatures();
    redDrawCreatures();

    redMoveOctopus();
    redMoveBubble();
    redDrawOctopus();
    redDrawBubble();

    redCheckBubbleCreaturesOverlap();
    redUpdateTimers();
    redDisplayUI();

    if (redTimer <= 0) {
      if (redScore > redHighScore) redHighScore = redScore;
      redGameState = "gameover";
    }
  }
  else if (redGameState === "gameover") {
    redDrawGameOverScreen();
  }
}

function redMousePressed() {
  if (redGameState === "menu" || redGameState === "gameover") {
    if (redLevel < redMaxLevel) {
      redLevel++;
      redLevelTime -= 10;
    } else {
      redLevel = 1;
      redLevelTime = 60;
      redScore = 0;
    }

    redInitGame();
    redGameState = "play";
    return;
  }

  if (redOctopus.bubble.state === "idle" && redBubbleCooldown <= 0) {
    redOctopus.bubble.state = "outbound";
    redBubbleCooldown = 20;
  }
}
function redKeyPressed(event) {
}

function redDrawSeaFloor() {
  push();
  fill("#332200");
  rect(0, height - 60, width, 60);
  pop();
}

function redDrawMenuScreen() {
  fill(255, 50);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("STARFISH SNATCHER", width/2, height/2 - 80);

  textSize(18);
  text("Move the octopus with your mouse", width/2, height/2 - 20);
  text("Click to shoot a bubble", width/2, height/2 + 10);
  text("Catch starfish and shells", width/2, height/2 + 40);
  text("Avoid jellyfish (score -2)", width/2, height/2 + 70);

  fill("#ffdd00");
  textSize(22);
  text("Click to start!", width/2, height/2 + 120);
}

function redDrawGameOverScreen() {
  fill(255, 80);
  rect(0,0,width,height);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(48);

  if (redLevel >= redMaxLevel)
    text("FINAL GAME OVER", width/2, height/2 - 80);
  else
    text("LEVEL COMPLETE!", width/2, height/2 - 80);

  textSize(28);
  text(`Score: ${redScore}`, width/2, height/2 - 20);
  text(`High Score: ${redHighScore}`, width/2, height/2 + 20);
  text(`Level: ${redLevel}`, width/2, height/2 + 60);

  fill("#ffdd00");
  textSize(22);
  text("Click to continue!", width/2, height/2 + 110);
}

function redInitGame() {
  redInitCreatures();
  redTimer = redLevelTime;
}

function redInitCreatures() {
  redCreatures = [];

  for (let i = 0; i < 6; i++) {
    let r = random();
    let type = "shell";

    if (r < 0.2) type = "jelly";
    else if (r < 0.5) type = "star";

    redCreatures.push({
      x: random(width),
      y: random(280),
      size: random(15, 22),
      speed: random(2, 3.5),
      type
    });
  }
}

function redMoveCreatures() {
  for (let c of redCreatures) {
    c.x += c.speed;
    c.y += sin(frameCount * 0.05) * 1.2;

    if (c.x > width) {
      c.x = 0;
      c.y = random(280);
    }
  }
}

function redDrawCreatures() {
  for (let c of redCreatures) {
    let img = null;

    if (c.type === "star")       img = redStarImg;
    else if (c.type === "jelly") img = redJellyImg;
    else if (c.type === "shell") img = redShellImg;

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

function redMoveOctopus() {
  redOctopus.body.x = mouseX;
}

function redMoveBubble() {
  redOctopus.bubble.x = redOctopus.body.x;

  if (redOctopus.bubble.state === "idle") {
    redOctopus.bubble.y = redOctopus.body.y - 20;
    return;
  }

  if (redOctopus.bubble.state === "outbound") {
    redOctopus.bubble.y -= redOctopus.bubble.speed;

    if (redOctopus.bubble.y <= 0) {
      redOctopus.bubble.state = "idle";
      redOctopus.bubble.y = redOctopus.body.y - 20;
    }
  }
}

function redDrawBubble() {
  if (redOctopus.bubble.state !== "idle") {
    fill("#88ccff");
    noStroke();
    ellipse(redOctopus.bubble.x, redOctopus.bubble.y, redOctopus.bubble.size);
  }
}

function redDrawOctopus() {
  if (redOctopusImg) {
    const w = redOctopus.body.size * 1.2;
    const h = redOctopus.body.size * 1.2;
    image(redOctopusImg, redOctopus.body.x, redOctopus.body.y, w, h);
  } else {
    fill(redOctopus.color);
    noStroke();
    ellipse(redOctopus.body.x, redOctopus.body.y, redOctopus.body.size);
    redDrawEyes();
  }
}

function redDrawEyes() {
  let eyeOffset = 25;
  let eyeY = redOctopus.body.y - 40;

  fill(255);
  ellipse(redOctopus.body.x - eyeOffset, eyeY, 20);
  ellipse(redOctopus.body.x + eyeOffset, eyeY, 20);

  fill(0);
  ellipse(redOctopus.body.x - eyeOffset + 3, eyeY, 8);
  ellipse(redOctopus.body.x + eyeOffset - 3, eyeY, 8);
}

function redCheckBubbleCreaturesOverlap() {
  if (redOctopus.bubble.state === "idle") return;

  for (let c of redCreatures) {
    let d = dist(redOctopus.bubble.x, redOctopus.bubble.y, c.x, c.y);

    if (d < redOctopus.bubble.size/2 + c.size/2) {
      redHandleCreatureCatch(c);
      c.x = random(width);
      c.y = random(280);
    }
  }
}

function redHandleCreatureCatch(c) {
  if (c.type === "star") redScore += 3;
  else if (c.type === "shell") redScore++;
  else if (c.type === "jelly") redScore -= 2;

  redOctopus.bubble.state = "idle";
}

function redUpdateTimers() {
  if (frameCount % 60 === 0 && redTimer > 0) redTimer--;
  if (redBubbleCooldown > 0) redBubbleCooldown--;
}

function redDisplayUI() {
  push();
  fill(255);
  textSize(20);

  text(`Score: ${redScore}`, 50, 20);
  text(`Time: ${redTimer}`, 50, 40);
  text(`Level: ${redLevel}`, 50, 60);

  if (redBubbleCooldown > 0)
    text("Cooldown...", 70, 80);

  pop();
}
