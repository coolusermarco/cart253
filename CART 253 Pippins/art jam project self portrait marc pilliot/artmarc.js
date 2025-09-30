/**
 * AUTHOR - marc pilliot
 * 
 * self portrait art jam
 * Pippin Barr
 *
 * This is a program where u can drag elements to form a portrait
 * of me, ive used online ressources which i'll credit to help with this
 * https://youtu.be/kjqo_uXn87I (drag images using p5)
 * 
 * then ive used some previous assignments and p5 ressources
 *  to help too
 */



let img, img2, img3, img4, img5;   // imported images

let hairX = 200, hairY = 160; // hair position
let eyesX = 200, eyesY = 200; // eyes position
let noseX = 200, noseY = 230; // nose position
let mouthX = 200, mouthY = 280; // mouth position
let bodyX = 200, bodyY = 350; // body position

let draggingHair = false;
let draggingEyes = false;
let draggingNose = false;
let draggingMouth = false;
let draggingBody = false;

function preload() {
  img = loadImage("images/miihair.jpg"); // hair img from my computer
  img2 = loadImage("images/miieyes.png");
  img3 = loadImage("images/miinose.png");
  img4 = loadImage("images/miimouth.png");
  img5 = loadImage("images/miibody.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER); // draw image from its center
  noStroke();
}

function draw() {
  background("#a7dfff");

  // draw body first (behind head)
  image(img5, bodyX, bodyY, 150, 100);

  // draw head and ears
  fill(210, 180, 140);
  ellipse(130, 200, 30, 70); // left ear
  ellipse(270, 200, 30, 70); // right ear
  ellipse(200, 200, 150, 180); // head

  // draw hair
  image(img, hairX, hairY, 350, 250);

  // draw eyes 
  image(img2, eyesX, eyesY, 120, 70);

  // draw nose 
  image(img3, noseX, noseY, 70, 50);

  // draw mouth
  image(img4, mouthX, mouthY, 80, 60);


  // move whichever part is being dragged
  if (draggingHair) {
    hairX = mouseX;
    hairY = mouseY;
  } else if (draggingEyes) {
    eyesX = mouseX;
    eyesY = mouseY;
  
  } else if (draggingNose) {
    noseX = mouseX;
    noseY = mouseY;
  } else if (draggingMouth) {
    mouthX = mouseX;
    mouthY = mouseY;
  
  } else if (draggingBody) {
    bodyX = mouseX;
    bodyY = mouseY;
  }
}


function mousePressed() {
  // check if mouse is being clicked near hair
  if (dist(mouseX, mouseY, hairX, hairY) < 150) {
    draggingHair = true;
  }
  // check if mouse is being clicked near eyes
  else if (dist(mouseX, mouseY, eyesX, eyesY) < 60) {
    draggingEyes = true;
  
  // same thing with the nose
  } else if (dist(mouseX, mouseY, noseX, noseY) < 40) {
    draggingNose = true;}
  
  // same thing with mouth and body
  else if (dist(mouseX, mouseY, mouthX, mouthY) < 50) {
    draggingMouth = true}
  
  else if (dist(mouseX, mouseY, bodyX, bodyY) < 100) {
    draggingBody = true;
  }
}

// stop dragging the body parts
function mouseReleased() {
  draggingHair = false;
  draggingEyes = false;
  draggingNose = false;
  draggingMouth = false;
  draggingBody = false;
}



