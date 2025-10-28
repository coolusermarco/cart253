"use strict";

// ---------------------- GAME OBJECTS ----------------------
const frog = {
    body: { x: 320, y: 520, size: 150 },
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" },
    visible: true,
    partialInvisibility: false,
    invisibilityTimer: 0,
    eyes: { size: 20, pupilSize: 10 },
    color: "#00ff00",
    colorTimer: 0
};

// ---------------------- GAME VARIABLES ----------------------
let flies = [];
let score = 0;
let timer = 60;
let tongueCooldown = 0;
let level = 1; // current level
let levelTime = 60; // starting timer for level 1
let maxLevel = 3;
let bgMusic;
let bgImg;
let highScore = 0;
let gameState = "menu"; // "menu", "play", "gameover"

// ---------------------- PRELOAD ----------------------
function preload() {
    bgMusic = loadSound("js/elektromania.mp3");
    bgImg = loadImage("js/background.png");
}

// ---------------------- SETUP ----------------------
function setup() {
    createCanvas(640, 480);
    initGame();

    if (bgMusic) {
        bgMusic.loop();
        bgMusic.setVolume(0.04);
    }
}

// ---------------------- DRAW LOOP ----------------------
function draw() {
    if (bgImg) image(bgImg, 0, 0, width, height);
    else background("#87ceeb");

    if (gameState === "menu") drawMenuScreen();
    else if (gameState === "play") {
        moveFlies();
        drawFlies();
        moveFrog();
        moveTongue();
        drawFrog();
        checkTongueFliesOverlap();

        updateTimers();
        displayUI();

        // Check for level end
        if (timer <= 0) {
            if (score > highScore) highScore = score;

            if (level >= maxLevel) {
                gameState = "gameover"; // after final level
            } else {
                gameState = "gameover"; // show level end screen first
            }
        }
    } else if (gameState === "gameover") {
        drawGameOverScreen();
    }
}

// ---------------------- MENU SCREEN ----------------------
function drawMenuScreen() {
    push();
    fill(255, 50);
    rect(0, 0, width, height);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("FROGFROGFROG, Mod Jam Challenge", width / 2, height / 2 - 80);

    textSize(18);
    text("Game Rules:", width / 2, height / 2 - 40);
    text("Move the frog with your mouse", width / 2, height / 2 - 10);
    text("Click to launch the tongue and catch flies", width / 2, height / 2 + 20);
    text("Catch golden flies for bonus points!", width / 2, height / 2 + 50);
    text("Avoid red flies... they lower your score!", width / 2, height / 2 + 80);

    textSize(22);
    fill("#00FF00");
    text("Click anywhere to start!", width / 2, height / 2 + 130);
    pop();
}

// ---------------------- GAME OVER / LEVEL END SCREEN ----------------------
function drawGameOverScreen() {
    push();
    fill(255, 150);
    rect(0, 0, width, height);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);
    if (level >= maxLevel && timer <= 0) text("FINAL GAME OVER", width / 2, height / 2 - 80);
    else text("LEVEL COMPLETE!", width / 2, height / 2 - 80);

    textSize(28);
    text(`Score: ${score}`, width / 2, height / 2 - 20);
    text(`High Score: ${highScore}`, width / 2, height / 2 + 20);
    text(`Level Reached: ${level}`, width / 2, height / 2 + 60);

    textSize(22);
    fill("#00FF00");
    text("Click anywhere to continue!", width / 2, height / 2 + 110);
    pop();
}

// ---------------------- GAMEPLAY LOGIC ----------------------
function initGame() {
    initFlies();
    timer = levelTime;
}

// Initialize flies
function initFlies() {
    flies = [];
    for (let i = 0; i < 5; i++) {
        let r = random();
        let color = r < 0.1 ? "red" : r < 0.3 ? "gold" : "black";
        flies.push({ x: random(width), y: random(300), size: random(10, 15), speed: random(2, 4), color });
    }
}

// Move flies
function moveFlies() {
    for (let f of flies) {
        f.x += f.speed;
        f.y += sin(frameCount * 0.1) * 2;
        if (f.x > width) { f.x = 0; f.y = random(0, 300); }
    }
}

// Draw flies
function drawFlies() {
    for (let f of flies) {
        push();
        noStroke();
        fill(f.color);
        ellipse(f.x, f.y, f.size);
        pop();
    }
}

// Move frog
function moveFrog() {
    frog.body.x = mouseX;
}

// Move tongue
function moveTongue() {
    frog.tongue.x = frog.body.x;
    if (frog.tongue.state === "idle") return;
    if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= height) { frog.tongue.state = "idle"; frog.tongue.y = 480; }
    }
}

// Draw frog
function drawFrog() {
    let alpha = frog.partialInvisibility && frog.invisibilityTimer > 0 ? 150 : 255;

    push();
    fill(255, 0, 0, alpha);
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    push();
    stroke(255, 0, 0, alpha);
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    push();
    fill(red(frog.color), green(frog.color), blue(frog.color), alpha);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    drawEyes(alpha);
}

// Eyes
function drawEyes(alpha = 255) {
    let eyeOffset = 30;
    let pupilOffset = 5;

    let leftEyeX = frog.body.x - eyeOffset;
    let rightEyeX = frog.body.x + eyeOffset;
    let eyeY = frog.body.y - 50;

    let leftPupilX = leftEyeX + constrain((mouseX - leftEyeX) * 0.1, -pupilOffset, pupilOffset);
    let leftPupilY = eyeY + constrain((mouseY - eyeY) * 0.1, -pupilOffset, pupilOffset);
    let rightPupilX = rightEyeX + constrain((mouseX - rightEyeX) * 0.1, -pupilOffset, pupilOffset);
    let rightPupilY = eyeY + constrain((mouseY - eyeY) * 0.1, -pupilOffset, pupilOffset);

    fill(255, alpha);
    ellipse(leftEyeX, eyeY, frog.eyes.size);
    ellipse(rightEyeX, eyeY, frog.eyes.size);

    fill(0, alpha);
    ellipse(leftPupilX, leftPupilY, frog.eyes.pupilSize);
    ellipse(rightPupilX, rightPupilY, frog.eyes.pupilSize);
}

// Check fly catch
function checkTongueFliesOverlap() {
    for (let f of flies) {
        let d = dist(frog.tongue.x, frog.tongue.y, f.x, f.y);
        if (d < frog.tongue.size / 2 + f.size / 2) {
            handleFlyCatch(f);
            f.x = random(width);
            f.y = random(0, 300);
        }
    }
}

// Handle fly catch
function handleFlyCatch(f) {
    frog.partialInvisibility = f.color === "red";
    frog.invisibilityTimer = frog.partialInvisibility ? 120 : 0;

    if (f.color === "gold") { frog.color = "#FFD700"; frog.colorTimer = 180; score += 5; }
    else if (f.color === "red") score -= 2;
    else score++;

    frog.tongue.state = "inbound";
}

// Input
function mousePressed() {
    if (gameState === "menu" || gameState === "gameover") {
        // move to next level or restart
        if (level < maxLevel) {
            level++;
            levelTime = max(10, levelTime - 10); // reduce timer by 10 sec each level
        } else {
            level = 1;
            levelTime = 60;
            score = 0;
        }
        initGame();
        gameState = "play";
        return;
    }

    if (frog.tongue.state === "idle" && tongueCooldown <= 0) {
        frog.tongue.state = "outbound";
        tongueCooldown = 30;
    }
}

// Timers & UI
function updateTimers() {
    if (frameCount % 60 === 0 && timer > 0) timer--;
    if (frog.invisibilityTimer > 0) { frog.invisibilityTimer--; if (frog.invisibilityTimer === 0) frog.partialInvisibility = false; }
    if (frog.colorTimer > 0) { frog.colorTimer--; if (frog.colorTimer === 0) frog.color = "#00ff00"; }
    if (tongueCooldown > 0) tongueCooldown--;
}

// Display UI
function displayUI() {
    push();
    fill(0);
    textSize(20);
    text(`Score: ${score}`, 10, 20);
    text(`Time: ${timer}`, 10, 40);
    text(`Level: ${level}`, 10, 60);
    if (tongueCooldown > 0) text("Cooldown...", 10, 80);
    pop();
}
