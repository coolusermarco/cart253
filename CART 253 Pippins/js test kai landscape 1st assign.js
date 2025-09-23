"use strict";

    /
     
OH LOOK I DIDN'T DESCRIBE SETUP!!*/
  function setup() {
  createCanvas(400, 400);}


    /
    *creates shapes and colors, visualizes them every frame
    /
    function draw() {
    background(214,72,215)
    drawSun()
    }

    function drawSun() {
        /
        makes the sun
        / 
        push();
        noStroke();
        fill(255, 174, 66);
        circle(200,150, 120);
        /
        makes the rays
        */
        push()
        stroke(255, 174, 66);
        line(200,200,200,250);

        push()
        stroke(255, 174, 66);
        line(200,150,300,200);

    }
