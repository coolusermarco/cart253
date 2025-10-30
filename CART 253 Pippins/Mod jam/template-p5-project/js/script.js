/**
 * Frogfrogfrog
 * Pippin Barr (Modded by Marc Pilliot)
 * for this project ive used numerous ressources from youtube playlists: https://www.youtube.com/playlist?list=PLM-syYolLbsw1WthUEWQETR3BbGlh4GNa
 * https://www.youtube.com/watch?v=pgfCl1b_ToY
 * 
 * A game of catching flies with your frog-tongue 
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Our frog
// the objects
const frog = {
    // The frog's body has a position and size
    body: { x: 320, 
        y: 520, 
        size: 150 },

    // The frog's tongue has a position, size, speed, and state
    tongue: { x: undefined, 
        y: 480, 
        size: 20, 
        speed: 20,

        // Determines how the tongue moves each frame 
        state: "idle" }, // State can be: idle, outbound, inbound


    visible: true,
    partialInvisibility: false,
    invisibilityTimer: 0,
    eyes: { size: 20, pupilSize: 10 },
    color: "#00ff00",
    colorTimer: 0
};

// the variables
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

// preload material
function preload() {
    bgMusic = loadSound("js/elektromania.mp3");
    bgImg = loadImage("js/background.png");
}

/**
 * Creates the canvas and initializes the fly
 */
// setup the game
function setup() {
    createCanvas(640, 480);
    initGame();

    if (bgMusic) {
        bgMusic.loop();
        bgMusic.setVolume(0.04);
    }
}

// the draw loop for game
function draw() {
    if (bgImg) image(bgImg, 0, 0, width, height);
    else background("#87ceeb");

    if (gameState === "menu") 
        drawMenuScreen();
    else if (gameState === "play") {
        moveFlies();
        drawFlies();
        moveFrog();
        moveTongue();
        drawFrog();
        checkTongueFliesOverlap();

        updateTimers();
        displayUI();

        // check if timer hits 0
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

// menu screen instructions
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

// game over screen + next level draw
function drawGameOverScreen() {
    push();
    fill(255, 150);
    rect(0, 0, width, height);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);
    if (level >= maxLevel && timer <= 0) 
        text("FINAL GAME OVER", width / 2, height / 2 - 80);
    else 
        text("LEVEL COMPLETE!", width / 2, height / 2 - 80);

    textSize(28);
    text(`Score: ${score}`, width / 2, height / 2 - 20);
    text(`High Score: ${highScore}`, width / 2, height / 2 + 20);
    text(`Level Reached: ${level}`, width / 2, height / 2 + 60);

    textSize(22);
    fill("#00FF00");
    text("Click anywhere to continue!", width / 2, height / 2 + 110);
    pop();
}

function initGame() {
    initFlies();
    timer = levelTime;
}

// initiates the flies w/ random property
function initFlies() {
    flies = []; // empty fly array

    for (let i = 0; i < 5; i++) {
        let r = random();// random number between 0 and 1

        // fly color probabilities
        let color = r < 0.1 ? "red" : r < 0.3 ? "gold" : "black";
        // add a new fly object with random values
        flies.push({ 
            x: random(width), 
            y: random(300), 
            size: random(10, 15), 
            speed: random(2, 4), 
            color });
    }
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */

// moves the flies animation
function moveFlies() {
    for (let f of flies) {
        // Move the fly
        f.x += f.speed;
        f.y += sin(frameCount * 0.1) * 2; // wave animation up and down
        if (f.x > width) { f.x = 0; 
            f.y = random(0, 300); }
    }
}


// Draw flies
function drawFlies() {
    // Loop through fly in the fly array
    for (let f of flies) {
        push();
        noStroke();
        fill(f.color); 
        ellipse(f.x, 
            f.y, 
            f.size);
        pop();
    }
}

/**
 * Moves the frog to the mouse position on x
 */
// Move frog
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") return;
    // If the tongue is outbound, it moves up
    if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) 
            frog.tongue.state = "inbound";

    }// If the tongue is inbound, it moves down 
    else if (frog.tongue.state === "inbound") 
        {
            // The tongue stops if it hits the bottom
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= height) 
            { frog.tongue.state = "idle"; 
            frog.tongue.y = 480; }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    let alpha = frog.partialInvisibility && frog.invisibilityTimer > 0 ? 150 : 255;
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();
    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();
    // Draw the frog's body
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

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFliesOverlap() {
    // loop through all the flies
    for (let f of flies) {
        // calculates distance between tongue and fly positions
        let d = dist(frog.tongue.x, frog.tongue.y, f.x, f.y);
        // Check if it's an overlap
        if (d < frog.tongue.size / 2 + f.size / 2) {
            // if fly is caught by tongue
            handleFlyCatch(f);
            // move fly to another position random
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

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    // if the player clicks while on the menu or gameover screen
    if (gameState === "menu" || gameState === "gameover") {
        // move to next level or restart
        if (level < maxLevel) {
            level++;
            levelTime = max(10, levelTime - 10); // reduce timer by 10 sec each level
        } else {
            // if all levels are played, restart the game from level 1
            level = 1;
            levelTime = 60;
            score = 0;
        }
        // reinitializes the game setup
        initGame();
        gameState = "play";
        return;
    }

    if (frog.tongue.state === "idle" && tongueCooldown <= 0) {
        frog.tongue.state = "outbound"; // launch the tongue forward
        tongueCooldown = 30; // add a delay before it can be used again
    }
}

// Timers & UI
function updateTimers() {
    // decrease timer of 1 fps
    if (frameCount % 60 === 0 && timer > 0) timer--;
    // frog's invisibility timer 
    if (frog.invisibilityTimer > 0) 
        { frog.invisibilityTimer--; 

            if (frog.invisibilityTimer === 0) 
                frog.partialInvisibility = false; // make the frog visible again
            }
    // frog color change timer
    if (frog.colorTimer > 0) 
        { frog.colorTimer--; 
            if (frog.colorTimer === 0) 
                frog.color = "#00ff00"; // reset frog color to default green
            }
    // tongue cooldown
    if (tongueCooldown > 0) 
        tongueCooldown--;
}

// Display UI
function displayUI() {
    push();
    fill(0);
    textSize(20);
    text(`Score: ${score}`, 10, 20);
    text(`Time: ${timer}`, 10, 40);
    text(`Level: ${level}`, 10, 60);
    if (tongueCooldown > 0) 
        text("Cooldown...", 10, 80);
    pop();
}
