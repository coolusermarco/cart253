/**
 * AUTHORS - kai maquivar, Marc Pilliot, Benedict Ambayec
 * 
 * Circle Master
 * Pippin Barr
 *
 * This will be a program in which the user can push a circle
 * on the canvas using their own circle.
 */

const target = {
  x: 200,
  y: 200,
  size: 100,
  fill: "#402f9eff" ,
  fills: {
    noOverlap: "#402f9eff", // red for no overlap
    overlap: "#2d672dff" // green for overlap 
  }
};

const puck = {
  x: 300,
  y: 100,
  size: 100,
  fill: "#ff0000"
  

};

const user = {
  x: undefined, // will be mouseX
  y: undefined, // will be mouseY
  size: 75,
  fill: "#000000"
};

/**
 * Create the canvas
 */
function setup() {
  createCanvas(400, 400);
}

/**
 * Move the user circle, check for overlap, draw the two circles
 */
function draw() {
  background("#a7dfffff");
  
  // Move user circle
  moveUser();
  
  // Draw the user and puck
  drawUser();
  drawPuck();
  movePuck();
  drawTarget();
  
}

/**
 * Sets the user position to the mouse position
 */
function moveUser() {
  user.x = mouseX;
  user.y = mouseY;
}

/**
 * Displays the user circle
 */
function drawUser() {
  push();
  noStroke();
  fill(user.fill);
  ellipse(user.x, user.y, user.size);
  pop();
}

/**
 * Displays the puck circle
 */
function drawPuck() {
  push();
  noStroke();
  fill(puck.fill);
  ellipse(puck.x, puck.y, puck.size);
  pop();
}

function drawTarget() {
  push();
  noStroke();
  fill(target.fill);
  ellipse(target.x, target.y, target.size);
  pop();
}

function movePuck()
{
    // Calculate distance between circles' centres
  const d = dist(user.x, user.y, puck.x, puck.y);
  const dC = dist(target.x, target.y, puck.x, puck.y)
  const overLU = (d < user.size/2 + puck.size/2);
  const overL = (dC < puck.size/2 + target.size/2);
  if (overLU) {
    puck.x += (puck.x - user.x) / 25
    puck.y += (puck.y - user.y) / 25
  } 
  else {
    target.fill = target.fills.noOverlap;
  }

  if(overL)
  {
    target.fill = target.fills.overlap
  }
  else
  {
    target.fill = target.fills.noOverlap
  }

  
}