/**
 * Lines
 * Marc Pilliot
 * 
 * A series of lines across the canvas
 */

"use strict";

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(500, 500);
}

/**
 * Draws lines across the canvas with increasing thickness and
 * gradually lightening colour
 */
function draw() {
    background("pink");
    
  let x = 0;
  let color = 0;

  while (x <= 500) {
    stroke(color);
    line(x, 0, x, height);

    x = x + 50;
    color = color + 25;
  }

let y = 0;
  let color2 = 0;

  while (y <= 500) {
    stroke(color2);
    line(0, y, width, y);
    y = y + 50;
    color2 = color2 + 25;
  }
}

// i was kind of overwhelmed and confused for the last step (i was home):// 