/**
 * Starfish Snatcher
 * based on Frogfrogfrog by Pippin Barr, modded by Marc Pilliot
 * 
 * A game of grabbing sea creatures with your octopus tentacle
 * 
 * Instructions:
 * - Move the octopus with your mouse (x-axis)
 * - Click to launch the tentacle
 * - Grab starfish and clams
 * - Avoid jellyfish, they stun you!
 * 
 * Made with p5
 */

"use strict";

// ===== OCTOPUS (Player) =====
const octopus = {
  body: {
    x: 320,
    y: 380,
    size: 150
  },
  tentacle: {
    x: undefined,
    y: 360,
    size: 16,
    speed: 18,
    state: "idle", // idle, outbound, inbound
    maxLength: 260
  },
  color: "#ff4faf",
  baseColor: "#ff4faf",
  rushColor: "#ffd700",

  stunned: false,
  stunTimer: 0
};

// ===== GAME VARIABLES =====
let seaCreatures = [];
let score = 0;
let timer = 60;
let level = 1;
let levelTime = 60;
let maxLevel = 3;
let gameState = "menu"; // "menu", "play", "gameover"
let highScore = 0;

let tentacleCooldown = 0;

// Combo / special mode
let starfishStreak = 0;
let treasureRushTimer = 0; // frames of Treasure Rush mode

// ===== SETUP & DRAW =====
function setup() {
  createCanvas(640, 480);
  initGame();
}

function draw() {
  drawBackground();

  if (gameState === "menu") {
    drawMenuScreen();
  } else if (gameState === "play") {
    moveSeaCreatures();
    drawSeaCreatures();

    moveOctopus();
    moveTentacle();
    drawOctopus();

    checkTentacleSeaCreaturesOverlap();

    updateTimers();
    displayUI();

    if (timer <= 0) {
      if (score > highScore) highScore = score;
      gameState = "gameover";
    }
  } else if (gameState === "gameover") {
    drawGameOverScreen();
  }
}

// ===== BACKGROUND =====
function drawBackground() {
  // Simple underwater gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color("#003366"), color("#001a33"), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Sea floor
  noStroke();
  fill("#553311");
  rect(0, height - 60, width, 60);

  // Bubbles
  for (let i = 0; i < 20; i++) {
    let bx = (frameCount * 0.5 + i * 30) % width;
    let by = (height - 20) - (frameCount * 0.8 + i * 25) % (height - 80);
    fill(255, 100);
    ellipse(bx, by, 8, 8);
  }
}

// ===== MENU SCREEN =====
function drawMenuScreen() {
  push();
  fill(0, 120);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("STARFISH SNATCHER", width / 2, height / 2 - 100);

  textSize(18);
  text("Move the octopus with your mouse (left/right)", width / 2, height / 2 - 40);
  text("Click to launch the tentacle", width / 2, height / 2 - 10);
  text("Grab ★ starfish for big points", width / 2, height / 2 + 20);
  text("Grab shells for small points", width / 2, height / 2 + 50);
  text("Avoid jellyfish... they STUN you!", width / 2, height / 2 + 80);

  textSize(22);
  fill("#ffd700");
  text("Click anywhere to start!", width / 2, height / 2 + 130);
  pop();
}

// ===== GAME OVER SCREEN =====
function drawGameOverScreen() {
  push();
  fill(0, 150);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);

  if (level >= maxLevel && timer <= 0) {
    text("FINAL GAME OVER", width / 2, height / 2 - 80);
  } else {
    text("LEVEL COMPLETE!", width / 2, height / 2 - 80);
  }

  textSize(26);
  text(`Score: ${score}`, width / 2, height / 2 - 20);
  text(`High Score: ${highScore}`, width / 2, height / 2 + 20);
  text(`Level Reached: ${level}`, width / 2, height / 2 + 60);

  textSize(22);
  fill("#ffd700");
  text("Click anywhere to continue!", width / 2, height / 2 + 110);
  pop();
}

// ===== GAME INIT =====
function initGame() {
  initSeaCreatures();
  timer = levelTime;
  score = score; // keep score between levels if you want
  tentacleCooldown = 0;
  octopus.stunned = false;
  octopus.stunTimer = 0;
  treasureRushTimer = 0;
  starfishStreak = 0;
}

// ===== SEA CREATURES =====
function initSeaCreatures() {
  seaCreatures = [];
  for (let i = 0; i < 7; i++) {
    let r = random();
    let type;
    let color;

    // Probability distribution
    if (r < 0.2) {
      type = "jellyfish"; // 20%
      color = "#ff4444";
    } else if (r < 0.55) {
      type = "starfish"; // 35%
      color = "#ffcc00";
    } else {
      type = "clam"; // 45%
      color = "#dddddd";
    }

    seaCreatures.push({
      x: random(width),
      y: random(80, 280),
      size: random(18, 26),
      speed: random(1.5, 3),
      type,
      color,
      phase: random(TWO_PI) // for individual vertical wave
    });
  }
}

function moveSeaCreatures() {
  for (let c of seaCreatures) {
    c.x += c.speed;

    // Wavy up/down movement
    c.phase += 0.03;
    c.y += sin(c.phase) * 1.5;

    // Wrap around
    if (c.x > width + 20) {
      c.x = -20;
      c.y = random(80, 280);
    }
  }
}

function drawSeaCreatures() {
  for (let c of seaCreatures) {
    push();
    noStroke();
    if (c.type === "starfish") {
      drawStarfish(c.x, c.y, c.size, c.color);
    } else if (c.type === "clam") {
      drawClam(c.x, c.y, c.size, c.color);
    } else if (c.type === "jellyfish") {
      drawJellyfish(c.x, c.y, c.size, c.color);
    }
    pop();
  }
}

// Simple starfish (5-pointed)
function drawStarfish(x, y, radius, col) {
  fill(col);
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI * (i / 5);
    let sx = x + cos(angle) * radius;
    let sy = y + sin(angle) * radius;
    vertex(sx, sy);
    let midAngle = angle + TWO_PI / 10;
    let sx2 = x + cos(midAngle) * (radius * 0.5);
    let sy2 = y + sin(midAngle) * (radius * 0.5);
    vertex(sx2, sy2);
  }
  endShape(CLOSE);
}

// Simple clam (shell)
function drawClam(x, y, size, col) {
  fill(col);
  arc(x, y, size * 1.5, size, PI, TWO_PI);
  fill(200);
  ellipse(x, y, size * 0.5, size * 0.3);
}

// Simple jellyfish
function drawJellyfish(x, y, size, col) {
  fill(col);
  ellipse(x, y, size * 1.3, size); // bell
  // tentacles
  stroke(col);
  strokeWeight(2);
  noFill();
  for (let i = -2; i <= 2; i++) {
    let tx = x + i * (size * 0.15);
    bezier(
      tx, y + size * 0.4,
      tx + 5, y + size * 0.7,
      tx - 5, y + size * 1.0,
      tx, y + size * 1.3
    );
  }
}

// ===== OCTOPUS MOVEMENT =====
function moveOctopus() {
  if (octopus.stunned) {
    // Slight wobble while stunned
    octopus.body.x += sin(frameCount * 0.2) * 0.5;
    return;
  }

  // Water-drift: smooth lerp to mouseX + gentle sinus wobble
  let targetX = mouseX;
  octopus.body.x += (targetX - octopus.body.x) * 0.1;
  octopus.body.x += sin(frameCount * 0.05) * 0.4;

  // Keep on screen
  octopus.body.x = constrain(octopus.body.x, 50, width - 50);
}

// ===== TENTACLE MOVEMENT =====
function moveTentacle() {
  octopus.tentacle.x = octopus.body.x;

  if (octopus.tentacle.state === "idle") {
    octopus.tentacle.y = octopus.body.y - 20;
    return;
  }

  if (octopus.tentacle.state === "outbound") {
    octopus.tentacle.y -= octopus.tentacle.speed;

    // If too long or hits top, come back
    if (
      octopus.body.y - octopus.tentacle.y >= octopus.tentacle.maxLength ||
      octopus.tentacle.y <= 0
    ) {
      octopus.tentacle.state = "inbound";
    }
  } else if (octopus.tentacle.state === "inbound") {
    octopus.tentacle.y += octopus.tentacle.speed;

    if (octopus.tentacle.y >= octopus.body.y - 20) {
      octopus.tentacle.state = "idle";
    }
  }
}

// ===== DRAW OCTOPUS & TENTACLE =====
function drawOctopus() {
  // Tentacle
  push();
  stroke("#ff6666");
  strokeWeight(octopus.tentacle.size);
  line(
    octopus.tentacle.x,
    octopus.tentacle.y,
    octopus.body.x,
    octopus.body.y
  );
  noStroke();
  fill("#ff6666");
  ellipse(octopus.tentacle.x, octopus.tentacle.y, octopus.tentacle.size);
  pop();

  // Body
  push();
  let col = octopus.color;
  fill(col);
  noStroke();
  ellipse(octopus.body.x, octopus.body.y, octopus.body.size);

  // Head bump
  ellipse(octopus.body.x, octopus.body.y - 40, octopus.body.size * 0.8, octopus.body.size * 0.7);

  // Eyes
  fill(255);
  let eyeOffset = 25;
  let eyeY = octopus.body.y - 45;
  ellipse(octopus.body.x - eyeOffset, eyeY, 20);
  ellipse(octopus.body.x + eyeOffset, eyeY, 20);

  // Pupils follow mouse a bit
  fill(0);
  let pupilOffset = 5;
  let leftEyeX = octopus.body.x - eyeOffset;
  let rightEyeX = octopus.body.x + eyeOffset;
  let leftPupilX = leftEyeX + constrain((mouseX - leftEyeX) * 0.08, -pupilOffset, pupilOffset);
  let rightPupilX = rightEyeX + constrain((mouseX - rightEyeX) * 0.08, -pupilOffset, pupilOffset);
  let pupilY = eyeY + constrain((mouseY - eyeY) * 0.08, -pupilOffset, pupilOffset);
  ellipse(leftPupilX, pupilY, 8);
  ellipse(rightPupilX, pupilY, 8);

  // Simple tentacles at bottom
  stroke(col);
  strokeWeight(10);
  noFill();
  for (let i = -3; i <= 3; i++) {
    let tx = octopus.body.x + i * 15;
    bezier(
      tx, octopus.body.y + 30,
      tx + 5, octopus.body.y + 50,
      tx - 5, octopus.body.y + 70,
      tx, octopus.body.y + 90
    );
  }

  pop();
}

// ===== COLLISIONS =====
function checkTentacleSeaCreaturesOverlap() {
  if (octopus.tentacle.state === "idle") return;

  for (let c of seaCreatures) {
    let d = dist(octopus.tentacle.x, octopus.tentacle.y, c.x, c.y);
    if (d < octopus.tentacle.size / 2 + c.size / 2) {
      handleCreatureCatch(c);
      // Reposition creature
      c.x = -random(40, 100);
      c.y = random(80, 280);
      c.phase = random(TWO_PI);
    }
  }
}

function handleCreatureCatch(c) {
  octopus.tentacle.state = "inbound";

  if (c.type === "starfish") {
    starfishStreak++;
    if (treasureRushTimer > 0) {
      score += 5; // bonus during Rush
    } else {
      score += 3;
    }

    // Activate Treasure Rush after 3 starfish streak
    if (starfishStreak >= 3) {
      treasureRushTimer = 60 * 5; // 5 seconds
      octopus.color = octopus.rushColor;
      starfishStreak = 0;
    }

  } else if (c.type === "clam") {
    score += 1;
    starfishStreak = 0;

  } else if (c.type === "jellyfish") {
    score -= 2;
    starfishStreak = 0;
    octopus.stunned = true;
    octopus.stunTimer = 60 * 2; // 2 seconds
    octopus.color = "#9999ff";
  }

  if (score < 0) score = 0;
}

// ===== INPUT =====
function mousePressed() {
  if (gameState === "menu" || gameState === "gameover") {
    // Progress levels similarly to original
    if (level < maxLevel) {
      level++;
      levelTime = max(15, levelTime - 10);
    } else {
      level = 1;
      levelTime = 60;
      score = 0;
    }
    initGame();
    gameState = "play";
    return;
  }

  if (gameState === "play") {
    if (octopus.stunned) return;
    if (octopus.tentacle.state === "idle" && tentacleCooldown <= 0) {
      octopus.tentacle.state = "outbound";
      tentacleCooldown = 20; // small cooldown
    }
  }
}

// ===== TIMERS & UI =====
function updateTimers() {
  // main timer (seconds)
  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }

  // stun
  if (octopus.stunned) {
    octopus.stunTimer--;
    if (octopus.stunTimer <= 0) {
      octopus.stunned = false;
      octopus.color = treasureRushTimer > 0 ? octopus.rushColor : octopus.baseColor;
    }
  }

  // treasure rush
  if (treasureRushTimer > 0) {
    treasureRushTimer--;
    if (treasureRushTimer <= 0 && !octopus.stunned) {
      octopus.color = octopus.baseColor;
    }
  }

  // tentacle cooldown
  if (tentacleCooldown > 0) tentacleCooldown--;
}

function displayUI() {
  push();
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 10, 10);
  text(`Time: ${timer}`, 10, 35);
  text(`Level: ${level}`, 10, 60);

  if (tentacleCooldown > 0) {
    text("Tentacle cooling...", 10, 85);
  }

  if (octopus.stunned) {
    fill("#ff4444");
    text("STUNNED!", 10, 110);
  }

  if (treasureRushTimer > 0) {
    fill("#ffd700");
    text("TREASURE RUSH!!!", 10, 135);
  }

  pop();
}
