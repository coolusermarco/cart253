/** STARFISH SNATCHER, 
 using my frogfrogfrog mod jam code and ressources listed in readme.md, 
 i need to fix bugs and add more stuff like pngs and try to implement things i took notes of from my classmates' frogfrogfrog games
 */

"use strict";

// OCTOPUS
const octopus = {
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
let starImg;
let shellImg;
let jellyImg;
let bgImg;
let octopusImg;
let creatures = [];
let score = 0;
let timer = 60;
let bubbleCooldown = 0;
let level = 1;
let levelTime = 60;
let maxLevel = 3;
let highScore = 0;
let gameState = "menu";

function preload() {
    starImg  = loadImage("assets/images/star.png");
    shellImg = loadImage("assets/images/shell.png");
    jellyImg = loadImage("assets/images/jelly.png");
    bgImg    = loadImage("assets/images/seafloor.png");
    octopusImg = loadImage("assets/images/octopus.png");
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

    if (gameState === "menu") drawMenuScreen();
    else if (gameState === "play") {
        moveCreatures();
        drawCreatures();

        moveOctopus();
        moveBubble();
        drawOctopus();
        drawBubble();

        checkBubbleCreaturesOverlap();
        updateTimers();
        displayUI();

        if (timer <= 0) {
            if (score > highScore) highScore = score;
            gameState = "gameover";
        }
    }
    else if (gameState === "gameover") drawGameOverScreen();
}

// SEA FLOOR
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

// GAME OVER SCREEN
function drawGameOverScreen() {
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
    text("Click to continue!", width/2, height/2 + 110);
}

// INIT GAME
function initGame() {
    initCreatures();
    timer = levelTime;
}

// CREATE CREATURES
function initCreatures() {
    creatures = [];
    
    for (let i = 0; i < 6; i++) {
        let r = random();
        let type = "shell";

        if (r < 0.2) type = "jelly";
        else if (r < 0.5) type = "star";

        creatures.push({
            x: random(width),
            y: random(280),
            size: random(15, 22),
            speed: random(2, 3.5),
            type
        });
    }
}

// MOVE CREATURES
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

// CREATURES 
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

// MOVE OCTOPUS
function moveOctopus() {
    octopus.body.x = mouseX;
}

// MOVE BUBBLE
function moveBubble() {
    octopus.bubble.x = octopus.body.x;

    if (octopus.bubble.state === "idle") {
        octopus.bubble.y = octopus.body.y - 20;
        return;
    }

    if (octopus.bubble.state === "outbound") {
        octopus.bubble.y -= octopus.bubble.speed;

        if (octopus.bubble.y <= 0) {
            octopus.bubble.state = "idle";
            octopus.bubble.y = octopus.body.y - 20;
        }
    }
}

// BUBBLE
function drawBubble() {
    if (octopus.bubble.state !== "idle") {
        fill("#88ccff");
        noStroke();
        ellipse(octopus.bubble.x, octopus.bubble.y, octopus.bubble.size);
    }
}

// OCTOPUS
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

// EYES
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

// COLLISIONS
function checkBubbleCreaturesOverlap() {
    if (octopus.bubble.state === "idle") return;

    for (let c of creatures) {
        let d = dist(octopus.bubble.x, octopus.bubble.y, c.x, c.y);

        if (d < octopus.bubble.size/2 + c.size/2) {
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

    octopus.bubble.state = "idle";
}

// MOUSE CLICK
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

    if (bubbleCooldown > 0) 
        text("Cooldown...", 70, 80);

    pop();
}
