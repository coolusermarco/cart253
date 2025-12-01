/**
 * ALIEN LASER
    UFO at the top of the screen
     Shoots down at creatures
    avoid the missiles thrown at u
     ufo has 3 HP, game over after 3 hits
   Uses images for background, octopus, and creatures
 */

"use strict";

// OCTOPUS
const octopus = {
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

// IMAGES FOR CREATURES + BACKGROUND + OCTOPUS
let starImg;
let shellImg;
let jellyImg;
let bgImg;
let octopusImg;

// GAME VARIABLES
let creatures = [];
let enemyBullets = []; 
let score = 0;
let timer = 60;
let bubbleCooldown = 0;
let level = 1;
let levelTime = 60;
let maxLevel = 3;
let highScore = 0;
let gameState = "menu";

function preload() {
    starImg    = loadImage("assets/images/alien.png");
    shellImg   = loadImage("assets/images/spaceship.png");
    jellyImg   = loadImage("assets/images/alien2.png");
    bgImg      = loadImage("assets/images/planet.png");
    octopusImg = loadImage("assets/images/ufo.png");
}

// SETUP
function setup() {
    createCanvas(640, 480);
    textFont("Cinzel");
    imageMode(CENTER);
    initGame();
}

function draw() {
    if (bgImg) {
        imageMode(CORNER);
        image(bgImg, 0, 0, width, height);
        imageMode(CENTER);
    } else {
        background("#003355");
        drawSeaFloor();
    }

    if (gameState === "menu") {
        drawMenuScreen();
    }
    else if (gameState === "play") {
        moveCreatures();
        moveEnemyBullets();
        moveOctopus();
        moveBubble();

        drawCreatures();
        drawEnemyBullets();
        drawOctopus();
        drawBubble();

        checkBubbleCreaturesOverlap();
        checkEnemyBulletsHitUFO();

        updateTimers();
        displayUI();

        if (timer <= 0) {
            if (score > highScore) highScore = score;
            gameState = "gameover";
        }
    }
    else if (gameState === "gameover") {
        drawGameOverScreen();
    }
}

function drawSeaFloor() {
    push();
    fill("#332200");
    rect(0, height - 60, width, 60);
    pop();
}

// MENU SCREEN
function drawMenuScreen() {
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
    text("Avoid spaceship bullets from the crafts!", width / 2, height / 2 + 70);

    fill("#ffdd00");
    textSize(22);
    text("Click to start!", width / 2, height / 2 + 120);
}

// GAME OVER SCREEN
function drawGameOverScreen() {
    fill(255, 80);
    rect(0, 0, width, height);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);

    if (level >= maxLevel)
        text("FINAL GAME OVER", width / 2, height / 2 - 80);
    else
        text("LEVEL COMPLETE!", width / 2, height / 2 - 80);

    textSize(28);
    text(`Score: ${score}`, width / 2, height / 2 - 20);
    text(`High Score: ${highScore}`, width / 2, height / 2 + 20);
    text(`Level: ${level}`, width / 2, height / 2 + 60);

    fill("#ffdd00");
    textSize(22);
    text("Click to continue!", width / 2, height / 2 + 110);
}

// INIT GAME
function initGame() {
    initCreatures();
    enemyBullets = [];
    timer = levelTime;
    octopus.hp = 3;
}

// CREATURES
function initCreatures() {
    creatures = [];

    for (let i = 0; i < 6; i++) {
        let r = random();
        let type = "shell";

        if (r < 0.2) type = "jelly"; 
        else if (r < 0.5) type = "star";

        creatures.push({
            x: random(width),
            y: random(300, height - 60),
            size: random(15, 22),
            speed: random(1.5, 3),
            type
        });
    }
}

// MOVE CREATURES
function moveCreatures() {
    for (let c of creatures) {
        c.x += c.speed;
        c.y += sin(frameCount * 0.03) * 0.5;

        if (c.x > width) {
            c.x = 0;
            c.y = random(300, height - 60);
        }

        if (c.type === "jelly") {
            if (random() < 0.01) {
                enemyBullets.push({
                    x: c.x,
                    y: c.y,
                    size: 8,
                    speed: 5
                });
            }
        }
    }
}

// DRAW CREATURES
function drawCreatures() {
    for (let c of creatures) {
        let img = null;

        if (c.type === "star")       img = starImg;
        else if (c.type === "jelly") img = jellyImg;
        else if (c.type === "shell") img = shellImg;

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

// ENEMY BULLETS
function moveEnemyBullets() {
    for (let b of enemyBullets) {
        b.y -= b.speed;
    }

    // remove bullets that go off the top
    enemyBullets = enemyBullets.filter(b => b.y > -20);
}

function drawEnemyBullets() {
    push();
    noStroke();
    fill("#ff4444");
    for (let b of enemyBullets) {
        ellipse(b.x, b.y, b.size);
    }
    pop();
}

function checkEnemyBulletsHitUFO() {
    let remaining = [];

    for (let b of enemyBullets) {
        let d = dist(b.x, b.y, octopus.body.x, octopus.body.y);
        if (d < octopus.body.size / 2) {
            octopus.hp--;

            if (octopus.hp <= 0) {
                gameState = "gameover";
                return;
            }
        } else {
            remaining.push(b);
        }
    }

    enemyBullets = remaining;
}

// MOVE OCTOPUS
function moveOctopus() {
    octopus.body.x = mouseX;
}

// MOVE BUBBLE
function moveBubble() {
    octopus.bubble.x = octopus.body.x;

    if (octopus.bubble.state === "idle") {
        octopus.bubble.y = octopus.body.y + 20;
        return;
    }

    if (octopus.bubble.state === "outbound") {
        octopus.bubble.y += octopus.bubble.speed;

        if (octopus.bubble.y >= height) {
            octopus.bubble.state = "idle";
            octopus.bubble.y = octopus.body.y + 20;
        }
    }
}

// DRAW BUBBLE
function drawBubble() {
    if (octopus.bubble.state !== "idle") {
        fill("#88ccff");
        noStroke();
        ellipse(octopus.bubble.x, octopus.bubble.y, octopus.bubble.size);
    }
}

// DRAW OCTOPUS
function drawOctopus() {
    if (octopusImg) {
        const w = octopus.body.size * 1.2;
        const h = octopus.body.size * 1.2;
        image(octopusImg, octopus.body.x, octopus.body.y, w, h);
    } else {
        fill(octopus.color);
        noStroke();
        ellipse(octopus.body.x, octopus.body.y, octopus.body.size);
        drawEyes();
    }
}

function drawEyes() {
    let eyeOffset = 25;
    let eyeY = octopus.body.y - 40;

    fill(255);
    ellipse(octopus.body.x - eyeOffset, eyeY, 20);
    ellipse(octopus.body.x + eyeOffset, eyeY, 20);

    fill(0);
    ellipse(octopus.body.x - eyeOffset + 3, eyeY, 8);
    ellipse(octopus.body.x + eyeOffset - 3, eyeY, 8);
}

function checkBubbleCreaturesOverlap() {
    if (octopus.bubble.state === "idle") return;

    for (let c of creatures) {
        let d = dist(octopus.bubble.x, octopus.bubble.y, c.x, c.y);
        if (d < octopus.bubble.size / 2 + c.size / 2) {
            handleCreatureCatch(c);
            c.x = random(width);
            c.y = random(300, height - 60);
        }
    }
}

function handleCreatureCatch(c) {
    if (c.type === "star") score += 3;
    else if (c.type === "shell") score++;
    else if (c.type === "jelly") score -= 2;

    if (score < 0) score = 0;

    octopus.bubble.state = "idle";
}

// MOUSE CLICK
function mousePressed() {
    if (gameState === "menu" || gameState === "gameover") {
        if (level < maxLevel) {
            level++;
            levelTime = max(20, levelTime - 10);
        } else {
            level = 1;
            levelTime = 60;
            score = 0;
        }

        initGame();
        gameState = "play";
        return;
    }

    if (octopus.bubble.state === "idle" && bubbleCooldown <= 0) {
        octopus.bubble.state = "outbound";
        bubbleCooldown = 20;
    }
}

// TIMERS
function updateTimers() {
    if (frameCount % 60 === 0 && timer > 0) timer--;
    if (bubbleCooldown > 0) bubbleCooldown--;
}

// UI
function displayUI() {
    push();
    fill(255);
    textSize(20);

    text(`Score: ${score}`, 50, 20);
    text(`Time: ${timer}`, 50, 40);
    text(`Level: ${level}`, 50, 60);
    text(`HP: ${octopus.hp}`, 50, 80);

    if (bubbleCooldown > 0)
        text("Cooldown...", 50, 100);

    pop();
}
