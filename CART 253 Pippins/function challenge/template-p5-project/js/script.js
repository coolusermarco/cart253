/**
 * Bouncy Ball Ball Bonanza
 * Pippin Barr
 * 
 * The starting point for a ball-bouncing experience of
 * epic proportions!
 */

/**
 * 
 * Kai Maquivar
 * Benedict Ambayec
 * Marc Pilliot
 */


"use strict";

// Our ball
const ball = {
    x: 300, 
    y: 20,
    width: 10,
    height: 10,
    velocity: {
        x: 0,
        y: 4,
    }
};

const ball2 = {
    x: 320,
    y: 20,
    width: 10,
    height: 10,
    velocity: {
        x: 0,
        y: 4,
    }
};

// Our paddle
const paddle = {
    x: 300,
    y: 280,
    width: 80,
    height: 10
};

/**
 * Create the canvas
*/
function setup() {
    createCanvas(600, 300);
}


/**
 * Move and display the ball and paddle
*/
function draw() {
    background("#87ceeb");
    movePaddle(paddle);
    moveBall(ball);
    moveBall2(ball2);
    handleBounce(ball, paddle);
    handleBounce(ball2, paddle);
    drawPaddle(paddle);
    drawBall(ball);
    drawBall2(ball2);
    resetBall();
    resetBall2();

}



/**
 * Bounces the provided ball off the provided paddle
 */
function handleBounce(ball, paddle) {
    const d = dist(ball.x, ball.y, paddle.x, paddle.y);
    // Check if it's an overlap
    const hit = (d < ball.width / 2 + paddle.height / 2);
    if (hit) {
        ball.velocity.y = -4
    }
}

function handleBounce2(ball2, paddle) {
    const d2 = dist(ball2.x, ball2.y, paddle.x, paddle.y);
    // Check if it's an overlap
    const hit2 = (d2 < ball2.width / 2 + paddle.height / 2);
    if (hit2) {
        ball2.velocity.y = -4
    }
}


function resetBall() {
    if (ball.y <= 5) {
        ball.y = 5
        ball.velocity.y = 4
    }

    if (ball.y >= 400) {
        ball.y = 0
        ball.velocity.y = 4
    }
}

function resetBall2() {
    if (ball2.y <= 5) {
        ball2.y = 5
        ball2.velocity.y = 4
    }

    if (ball2.y >= 400) {
        ball2.y = 0
        ball2.velocity.y = 4
    }
}

/**
 * Draws the specified paddle on the canvas
 */
function drawPaddle(paddle) {
    push();
    rectMode(CENTER);
    noStroke();
    fill("pink");
    rect(paddle.x, paddle.y, paddle.width, paddle.height);
    pop();
}

/**
 * Draws the specified ball on the canvas
 */
function drawBall(ball) {
    push();
    rectMode(CENTER);
    noStroke();
    fill("pink");
    rect(ball.x, ball.y, ball.width, ball.height);
    pop();
}
function drawBall2(ball2) {
    push();
    rectMode(CENTER);
    noStroke();
    fill("gray");
    rect(ball2.x, ball2.y, ball2.width, ball2.height);
    pop();
}

function movePaddle(paddle) {
    // set positions of paddle x to mouse x
    paddle.x = mouseX;

    // keep the paddle inside the canvas box
    paddle.x = constrain(paddle.x, paddle.width / 2, width - paddle.width / 2);
}


function moveBall(ball) {
    // added velocity to the current position
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;
}

function moveBall2(ball2) {
    // added velocity to the current position
    ball2.x += ball2.velocity.x;
    ball2.y += ball2.velocity.y;
}



/**
 * Returns true if rectA and rectB overlap, and false otherwise
 * Assumes rectA and rectB have properties x, y, width and height to describe
 * their rectangles, and that rectA and rectB are displayed CENTERED on their
 * x,y coordinates.
 */
function checkOverlap(rectA, rectB) {
    return (rectA.x + rectA.width / 2 > rectB.x - rectB.width / 2 &&
        rectA.x - rectA.width / 2 < rectB.x + rectB.width / 2 &&
        rectA.y + rectA.height / 2 > rectB.y - rectB.height / 2 &&
        rectA.y - rectA.height / 2 < rectB.y + rectB.height / 2);
}