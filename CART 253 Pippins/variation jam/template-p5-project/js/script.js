/**
 * Starfish Snatcher
 * Simple variation of Frogfrogfrog
 * Same structure, new theme
 */

"use strict";

// Our octopus
const octopus = {
    body: { x: 320, y: 420, size: 140 },

    tentacle: {
        x: undefined,
        y: 400,
        size: 18,
        speed: 20,
        state: "idle" // idle, outbound, inbound
    },

    color: "#ff66aa",
    eyes: { size: 20, pupilSize: 10 },
    colorTimer: 0
};

// Variables
let creatures = [];
let score = 0;
let timer = 60;
let tentacleCooldown = 0;

let level = 1;
let levelTime = 60;
let maxLevel = 3;

let gameState = "menu";
let highScore = 0;

// Setup
function setup() {
    createCanvas(640, 480);
    initGame();
}

function draw() {
    background("#003355"); // deep ocean blue
    drawSeaFloor();

    if (gameState === "menu") drawMenuScreen();
    else if (gameState === "play") {
        moveCreatures();
        drawCreatures();

        moveOctopus();
        moveTentacle();
        drawOctopus();

        checkTentacleCreatureOverlap();
        updateTimers();
        displayUI();

        if (timer <= 0) {
            if (score > highScore) highScore = score;
            gameState = "gameover";
        }
    }
    else if (gameState === "gameover") drawGameOverScreen();
}

// Sea floor
function drawSeaFloor() {
    push();
    fill("#332200");
    rect(0, height - 60, width, 60);
    pop();
}

// Menu screen
function drawMenuScreen() {
    push();
    fill(255, 40);
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("STARFISH SNATCHER", width/2, height/2 - 80);

    textSize(18);
    text("Move the octopus with your mouse", width/2, height/2 - 20);
    text("Click to launch the tentacle", width/2, height/2 + 10);
    text("Grab ★ starfish & shells!", width/2, height/2 + 40);
    text("Avoid jellyfish (score -2)", width/2, height/2 + 70);

    fill("#ffdd00");
    textSize(22);
    text("Click anywhere to start", width/2, height/2 + 120);
    pop();
}

// Game over
function drawGameOverScreen() {
    push();
    fill(255, 80);
    rect(0,0,width,height);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);

    if (level >= maxLevel)
        text("FINAL GAME OVER", width/2, height/2 - 80);
    else
        text("LEVEL COMPLETE!", width/2, height/2 - 80);

    textSize(28);
    text(`Score: ${score}`, width/2, height/2 - 20);
    text(`High Score: ${highScore}`, width/2, height/2 + 20);
    text(`Level: ${level}`, width/2, height/2 + 60);

    fill("#ffdd00");
    textSize(22);
    text("Click anywhere to continue!", width/2, height/2 + 110);
    pop();
}

function initGame() {
    initCreatures();
    timer = levelTime;
}

// Creatures (starfish, shell, jellyfish)
function initCreatures() {
    creatures = [];
    
    for (let i = 0; i < 6; i++) {
        let r = random();
        let type = "shell";  // default

        if (r < 0.2) type = "jelly";     // 20%
        else if (r < 0.5) type = "star"; // 30%

        creatures.push({
            x: random(width),
            y: random(280),
            size: random(14, 20),
            speed: random(2, 4),
            type
        });
    }
}

// Move creatures
function moveCreatures() {
    for (let c of creatures) {
        c.x += c.speed;
        c.y += sin(frameCount * 0.05) * 1.2;

        if (c.x > width) {
            c.x = 0;
            c.y = random(280);
        }
    }
}

// Draw creatures
function drawCreatures() {
    for (let c of creatures) {
        push();
        noStroke();

        if (c.type === "star") fill("#ffcc00");     // yellow
        else if (c.type === "jelly") fill("#ff5555"); // red-ish
        else fill("#ffffff");                        // shell

        ellipse(c.x, c.y, c.size);
        pop();
    }
}

// Move octopus
function moveOctopus() {
    octopus.body.x = mouseX;
}

// Move tentacle
function moveTentacle() {
    octopus.tentacle.x = octopus.body.x;

    if (octopus.tentacle.state === "idle") return;

    if (octopus.tentacle.state === "outbound") {
        octopus.tentacle.y -= octopus.tentacle.speed;
        if (octopus.tentacle.y <= 0)
            octopus.tentacle.state = "inbound";
    }
    else if (octopus.tentacle.state === "inbound") {
        octopus.tentacle.y += octopus.tentacle.speed;
        if (octopus.tentacle.y >= octopus.body.y - 20) {
            octopus.tentacle.state = "idle";
            octopus.tentacle.y = octopus.body.y - 20;
        }
    }
}

// Draw octopus
function drawOctopus() {
    // Tentacle
    push();
    stroke("#ff8888");
    strokeWeight(octopus.tentacle.size);
    line(
        octopus.tentacle.x,
        octopus.tentacle.y,
        octopus.body.x,
        octopus.body.y
    );
    pop();

    // Tentacle tip
    push();
    fill("#ff6666");
    noStroke();
    ellipse(octopus.tentacle.x, octopus.tentacle.y, octopus.tentacle.size);
    pop();

    // Body
    push();
    fill(octopus.color);
    noStroke();
    ellipse(octopus.body.x, octopus.body.y, octopus.body.size);
    pop();

    drawEyes();
}

// Eyes
function drawEyes() {
    let eyeOffset = 25;
    let eyeY = octopus.body.y - 40;

    let pupilOffset = 5;

    let leftEyeX = octopus.body.x - eyeOffset;
    let rightEyeX = octopus.body.x + eyeOffset;

    fill(255);
    ellipse(leftEyeX, eyeY, octopus.eyes.size);
    ellipse(rightEyeX, eyeY, octopus.eyes.size);

    fill(0);
    ellipse(
        leftEyeX + constrain((mouseX - leftEyeX) * 0.1, -pupilOffset, pupilOffset),
        eyeY + constrain((mouseY - eyeY) * 0.1, -pupilOffset, pupilOffset),
        octopus.eyes.pupilSize
    );
    ellipse(
        rightEyeX + constrain((mouseX - rightEyeX) * 0.1, -pupilOffset, pupilOffset),
        eyeY + constrain((mouseY - eyeY) * 0.1, -pupilOffset, pupilOffset),
        octopus.eyes.pupilSize
    );
}

// Check collisions
function checkTentacleCreatureOverlap() {
    for (let c of creatures) {
        let d = dist(octopus.tentacle.x, octopus.tentacle.y, c.x, c.y);

        if (d < octopus.tentacle.size/2 + c.size/2) {
            handleCreatureCatch(c);
            c.x = random(width);
            c.y = random(280);
        }
    }
}

function handleCreatureCatch(c) {
    if (c.type === "star") score += 3;
    else if (c.type === "shell") score++;
    else if (c.type === "jelly") score -= 2;

    octopus.tentacle.state = "inbound";
}

// Input
function mousePressed() {
    if (gameState === "menu" || gameState === "gameover") {
        if (level < maxLevel) {
            level++;
            levelTime -= 10;
        } else {
            level = 1;
            levelTime = 60;
            score = 0;
        }
        initGame();
        gameState = "play";
        return;
    }

    if (octopus.tentacle.state === "idle" && tentacleCooldown <= 0) {
        octopus.tentacle.state = "outbound";
        tentacleCooldown = 25;
    }
}

// Timers
function updateTimers() {
    if (frameCount % 60 === 0 && timer > 0) timer--;
    if (tentacleCooldown > 0) tentacleCooldown--;
}

// UI
function displayUI() {
    fill(255);
    textSize(20);
    text(`Score: ${score}`, 10, 20);
    text(`Time: ${timer}`, 10, 40);
    text(`Level: ${level}`, 10, 60);

    if (tentacleCooldown > 0)
        text("Cooldown...", 10, 80);
}
