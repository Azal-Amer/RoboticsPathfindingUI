let points = [];
let clickCount = 0;
let dragging = false;
let dragIndex = -1;
let boxX, boxY;
let index = 0;
let speed = .0125;
let step = 0;
let lineIndex = 0;
let pathLength = 0;
let boxwidth=50;
boxheight = 50;
weight = 3
let globalRotate;
let robotCodeArray = [];
let pxInchesConstant;
wholecode = "yay";
let copyBtn;
let myString = 'fsdf';

// function updateOutput(wholecode) {
//   console.log(wholecode)
//   output.textContent = wholecode;
// }
// updateOutput('put somethng in idiot')
// copyBtn.addEventListener("click", function() {
//   const textarea = document.createElement("textarea");
//   textarea.value = wholecode;
//   document.body.appendChild(textarea);
//   textarea.select();
//   document.execCommand("copy");
//   textarea.remove();
// });
// Set the string to be displayed in the output box

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

function updateWidth() {
    boxwidth = pxInchesConstant*this.value();
    
  }
  function updateHeight() {
    boxheight = pxInchesConstant*this.value();
    
  }
function outputVectorArray(linePoints,length){
    robotVectors = []
    if(length>=1){
        for (var i = 0; i < linePoints.length-1; i++) {
            var deltaX = linePoints[i].x - linePoints[i + 1].x;
            var deltaY = linePoints[i].y - linePoints[i + 1].y;
            var magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            var angle = radians_to_degrees(Math.atan2(deltaY, deltaX));
            var rotationType = linePoints[i].state
            if(rotationType == -1){
                rotationType = "R"
            }
            else{
                rotationType = 'S'
            }
            if(angle<0){
              angle = 360+angle
            }

            robotVectors.push([magnitude, angle,rotationType]);
        
            
        }

    }
    else{
        console.log('if you see this and more than two points on the screen, smthn broke')
    }
    
    return robotVectors
}
function convertGlobalAnglesToRelative(vectors) {
  const result = [];
  let prevAngle = 0; // start with zero angle
  for (let i = 0; i < vectors.length; i++) {
    const [magnitude, globalAngle] = vectors[i];
    relativeAngle = globalAngle - prevAngle; // subtract previous angle from global angle
    if(relativeAngle<0){
      relativeAngle = 360+relativeAngle
    }
    prevAngle = globalAngle; // update previous angle
    result.push([magnitude/pxInchesConstant, relativeAngle]);
  }
  return result;
}
function readFile(callback) {
  fetch("encoderDrivefunction.txt")
    .then(response => response.text())
    .then(data => callback(data))
    // .catch(error => console.error(error));
}

function printInstruction(){
    let relativeAngleVectors = [];

    setTimeout(()=>{
      relativeAngleVectors = convertGlobalAnglesToRelative(robotCodeArray)
      readFile(function(contents) {
        neededFunctions = contents.split('//ROAD WALKER DRIVE//')[0]
        // contents = splitString(contents,'//ROAD WALKER ROTATE//')
        drive = contents.split('//ROAD WALKER DRIVE//')[1].split('//ROAD WALKER ROTATE//')[0]
        rotater = contents.split('//ROAD WALKER DRIVE//')[1].split('//ROAD WALKER ROTATE//')[1]
        driveFunction = drive.split('<plug here>')
        console.log(rotater)
        rotater = rotater.split('<plug here>')
        console.log('fdsafd')
        // console.log(rotater[0]+rota)
        wholecode = neededFunctions + "\n"
        for(i=0;i<relativeAngleVectors.length;i++){
          drive = driveFunction[0]+relativeAngleVectors[i][0] + driveFunction[1]
          rotatey = rotater[0]+String(relativeAngleVectors[i][1])+rotater[1]
          
          if(i==0){
            angleCode = "//Starting angle is at ", relativeAngleVectors[i][1]
          }
          else{
            angleCode = rotatey
          }
          wholecode+=drive+"\n" + "//Path " + (i+1) +"\n"+angleCode
          
        }
        console.log(wholecode)
        // myString = wholecode

        
        
      })
      console.log(relativeAngleVectors)
    },1000)
    ;
    // Okay from here we need to take relativeAngleVectors, and plug them into the code blocks, then display them.
}
function vectorConvert(pointArray) {
    let vectorArray = [];
    for (let i = 0; i < pointArray.length; i++) {
      let x = Number(pointArray[i].x);
      let y = Number(pointArray[i].y);
      vector = createVector(x, y)
    //   vector.x = x
    //   vector.y = y
      vectorArray.push(vector);
    }

    return vectorArray;
  }
  
function calculatePosition(points, t) {
    let i = lineIndex;

    
    let start = points[i];
    let end = points[i + 1];
    // The bug happens when the start vanishes
    
    let rotate = 0
    if(typeof end == 'undefined' ){
        end = points[i-1]
    }
    if(typeof start == 'undefined'){
        start = points[i-1];
        lineIndex+=-1;
    }
    else{
        let x = lerp(start.x, end.x, t);
    let y = lerp(start.y, end.y, t);
    if (start.state == -1){
        // If the start points is red, then have it hold some rotation
        if(i>=robotCodeArray.length){
            i = robotCodeArray.length-1

        }
        rotate = robotCodeArray[i][1]
        globalRotate = rotate
    }
    else{
        if(i!=0){
            rotate = globalRotate
        }
        
    }

    
    return [createVector(x, y),rotate];

    }
    // Calculate position takes the current point, and literally interpolates it
    
}
function setup() {

    fieldImg = loadImage("field.png");
  canvas1 = createCanvas(600, 600);
    canvas1.parent("canvas-container")
    pxInchesConstant=width/(144)
  let button = createButton("Delete All");
//   button.position(610, 10);
  button.parent("button")
  button.mousePressed(deleteAll);
  let boxzbutton = createButton("Log Instructions");
//   boxzbutton.position(610, 50);
  boxzbutton.parent("button")
  boxzbutton.mousePressed(printInstruction);
  
  let widthInput = createInput();
    widthInput.parent("textbox1");
    widthInput.input(updateWidth);

    let heightInput = createInput();
    heightInput.parent("textbox2");
    heightInput.input(updateHeight);

}

function draw() {
  image(fieldImg, 0, 0, width, height);

  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    if(point.state == 1){
        fill(0, 0, 255);
    }
    else{
        fill(255,0,0)
    }
    
    ellipse(point.x, point.y, 20, 20);

    if (i < points.length - 1) {
        strokeWeight(weight);
        stroke(0, 255, 0);
      let nextPoint = points[i + 1];
      line(point.x, point.y, nextPoint.x, nextPoint.y);
    }
  }
//   This above block plots the circles and lines
  
  if(points.length>1){
    
    
    strokeWeight(2);
    stroke(0, 255, 0);
    for (let i = 0; i < vectors.length - 1; i++) {
        let start = vectors[i];
        let end = vectors[i + 1];
        line(start.x, start.y, end.x, end.y);
    }
    let pos;
    if(points.length>1){ 
        pos = calculatePosition(points, step);
    }

    
    
    fill(255, 0, 0);
    // rotate(rotate, angleMode = 'DEGREES')
    push();
    translate(pos[0].x , pos[0].y )
    rotation = pos[1]
    if(rotation<0){
      rotation = 360+rotation
    }
    rotation = radians(rotation)
    rotate(rotation)

    rect(-boxheight/2,-boxwidth/2, Number(boxheight), Number(boxwidth));
    fill(0)
    stroke(0)
    rect(-boxheight/2-5,-boxwidth/2,10,10)
    rect(-boxheight/2,boxwidth/2-5,10,10)
    pop();

    step += speed;
    if (step > 1) {
        step = 0;
        lineIndex++;
        if (lineIndex >= vectors.length - 1) {
        lineIndex = 0;
        }
    }
    for (let i = 1; i < vectors.length; i++) {
        pathLength += dist(vectors[i-1].x, vectors[i-1].y, vectors[i].x, vectors[i].y);
        }
}

 
}

function mouseClicked() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  if (!dragging) {
    let pointClicked = false;

    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      let distance = dist(point.x, point.y, mouseX, mouseY);
    //   picks the point we are closest to
    // One issue here is that if two points are within this radius, it's not exclusive

      if (distance < 10) {
        pointClicked = true;
        clickCount++;
        break;
      }
    }

    if (!pointClicked) {
      addPoint();
    //   if the mouse is clicked, but a point isn't, we know that its new space
    } else {
      if (clickCount === 2) {
        deletePoint();
        clickCount = 0;
      } 
    //   This checks if there have been two clicks first, then if not it asks for one click
      else {
        setTimeout(() => {
          if (clickCount === 1) {
            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                let distance = dist(point.x, point.y, mouseX, mouseY);
            
                if (distance < 10) {
                    point.state=-1*point.state

                    break;
                }
              }
            
            clickCount = 0;
          }
        }, 300);
      }
    }
  }
  vectors = vectorConvert(points)
}

function addPoint() {
    
    console.log('added point')
    vectors = vectorConvert(points)
  points.push({
    x: mouseX,
    y: mouseY,
    state: -1
  });
  robotCodeArray = outputVectorArray(points,points.length)
}
function deletePoint() {
    vectors = vectorConvert(points)
    
    
    console.log('deleted a point')
    for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let distance = dist(point.x, point.y, mouseX, mouseY);

    if (distance < 10) {
      points.splice(i, 1);
      break;
    }
    
  }
  robotCodeArray = outputVectorArray(points,points.length)
}

function mouseDragged() {
    // robotCodeArray = outputVectorArray(points)
    console.log('ddragged a point')
  dragging = true;
  vectors = vectorConvert(points)

  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let distance = dist(point.x, point.y, mouseX, mouseY);

    if (distance < 30) {
      dragIndex = i;
      point.x = mouseX;
      point.y = mouseY;
      break;
    }
  }

}

function mouseReleased() {
    robotCodeArray = outputVectorArray(points,points.length)
    console.log('released')
  if (dragIndex !== -1) {
    dragIndex = -1;
  }
  if(dragging == true){

    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let distance = dist(point.x, point.y, mouseX, mouseY);
    
        if (distance < 30) {
          dragIndex = i;
          point.state = point.state*-1
        }
      }
  }
  
  dragging = false;

  
  
}

function deleteAll() {
  points = [];
   index = 0;
     speed = .025;
     step = 0;
     lineIndex = 0;
     pathLength = 0;
}


