let roboBase; //start block for ROBO
let randomNumbersArrayX = [];
let randomNumbersArrayY = [];
let size; //size of a grid cell
let gridState = []; //an array for grid values to have different colors of grid
let xPos = [0]; //x position of a robot
let yPos = [0]; //y position of a robot
let routeArray = []; //array describing the programmed route
let Go2TimerID;
let interval = 500;

let doGo; //a variable for a function to make robot walk the routeArray
let doAlert;

let font;
//let meteorVisible;

// //buttons to control robot
// let buttonGo;
// let buttonRight;
// let buttonLeft;
// let buttonUp;
// let buttonDown;
// let buttonRemove;

//robot, different ground variables, obstacle, etc.
let robot, ground1, ground2, obstacle, meteor, roboAlert, btnRight, btnLeft, btnUp, btnDown, btnRemove, btnGo;
let obstaclesNumber = 5; //number of obstacles to place on the grid
let obstacleX = []; //x position of an obstacle
let obstacleY = []; //y position of an obstacle
let meteoNumber;
let meteoX = [];
let meteoY = [];
let meteoFact1, meteoFact2, meteoFact3;
let meteoFactsArray = [];
let meteoCount = 0;

let finalImage; //a message in the end of the game

//preload images
function preload() {
  robot = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/robo_1.png');
  ground1 = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/ground_1.png');
  ground2 = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/ground_2.png');
  roboBase = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/robo_base.png');

  obstacle = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/rock.png');
  btnRight = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/DDC8CF8F-AD81-49BA-8A00-0265D946F87E.png');
  btnLeft = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/85C781B3-0AC6-4BB7-BA61-F5DBB06A415A.png');
  btnUp = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/CA40FDF9-8FF4-4935-985A-14C3C86D72D6.png');
  btnDown = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/E0ABC246-156F-425B-8963-A9C5F421B511.png');
  btnRemove = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/286BFEBD-36EA-43D3-A9E3-3AF543BE3AEB.png');
  btnGo = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/C92AE74D-CCF6-43E7-A53F-7793B83F20B4.png');
  roboAlert = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/robo_alert.png');
  meteor = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/meteo.png');
  meteoFact1 = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/meteo_alert_1.png');
  meteoFact2 = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/meteo_alert_2.png');
  meteoFact3 = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/meteo_alert_3.png');
  finalImage = loadImage('https://raw.githubusercontent.com/StepanKukharskiy/robot/master/fin.png');

}


function setup() {
  var canvasWidth = screen.width * 0.8;

  if (screen.width * 0.8 > 1000) {
    canvasWidth = 800;
  }

  size = canvasWidth / 10;

  var c = createCanvas(canvasWidth, canvasWidth);
  c.parent('sketch-holder');
  background(254);

  randomNumbersX();
  randomNumbersY();

  GridState();
  Grid();
  Go();


  font = width / 50;


  //x & y positions of the obstacles
  for (let i = 0; i < obstaclesNumber; i++) {
    obstacleX.push(randomNumbersArrayX[i]);
  }
  //console.log(obstacleX);
  for (let j = 0; j < obstaclesNumber; j++) {

    if (randomNumbersArrayY[j] === 0) {
      obstacleY.push(1);
    } else {
      obstacleY.push(randomNumbersArrayY[j]);
    }
  }
  //console.log(obstacleY);

  //meteoFactsArray = [1, 2, 3];
  meteoFactsArray = [meteoFact1, meteoFact2, meteoFact3];
  meteoNumber = meteoFactsArray.length;


  for (let i = obstaclesNumber; i < obstaclesNumber + meteoNumber; i++) {
    meteoX.push(randomNumbersArrayX[i]);
    //console.log(meteoX);
  }
  for (let j = obstaclesNumber; j < obstaclesNumber + meteoNumber; j++) {
    meteoY.push(randomNumbersArrayY[j]);
    //console.log(randomNumbersArrayY[j]);
    //console.log(meteoY);
  }

  Obstacles();
  mouseReleased();
  //console.log(meteoFactsArray.length);

}

function draw() {
  if (meteoCount === 3 && xPos[counter] === 0 && yPos[counter] === 0) {
      return;
    }
  route();
}

//move robot right
function Right() {
  xPos.push(xPos[xPos.length - 1] + size);
  yPos.push(yPos[yPos.length - 1]);
  routeArray.push('направо');
}

//move robot left
function Left() {
  xPos.push(xPos[xPos.length - 1] - size);
  yPos.push(yPos[yPos.length - 1]);
  routeArray.push('_налево');
}

//move robot up
function Up() {
  xPos.push(xPos[xPos.length - 1]);
  yPos.push(yPos[yPos.length - 1] - size);
  routeArray.push('__вверх');
}

//move robot down
function Down() {
  xPos.push(xPos[xPos.length - 1]);
  yPos.push(yPos[yPos.length - 1] + size);
  routeArray.push('___вниз');
}

//delete last step from the routeArray
function Remove() {
  xPos.pop();
  yPos.pop();
  routeArray.pop();
}

//function to declare different state of each cell of the grid
function GridState() {
  for (var k = 0; k < width / size - 2; k++) {
    gridState[k] = [];
    for (var l = 0; l < height / size - 2; l++) {
      gridState[k][l] = Math.floor(Math.random() * 2);
      //console.log(gridState);
    }
  }
  return gridState;
}

//function to draw the grid that robot moves across
function Grid() {

  for (var i = 0; i < width / size - 2; i++) {
    for (var j = 0; j < height / size - 2; j++) {

      if (gridState[i][j] == 0) {
        image(ground1, i * size, j * size, size, size);
      } else if (gridState[i][j] == 1) {
        image(ground2, i * size, j * size, size, size);
      }
    }
  }
}

//function to make the robot move
function Go() {
  clearGo();
  counter = 0;
  meteoCount = 0;


  doGo = setInterval(function() {
    Grid();
    Obstacles();
    Meteors();

    image(roboBase, 0, 0, size, size);

    image(robot, xPos[counter] + size * 0.05, yPos[counter] + size * 0.05, size - size * 0.1, size - size * 0.1);

    for (var i = 0; i < obstacleX.length; i++) {
      if (xPos[counter] === obstacleX[i] * size && yPos[counter] === obstacleY[i] * size || xPos[counter] < 0 || xPos[counter] > width || yPos[counter] < 0 || yPos[counter] > height) {
        alertRock();
        return;
      }
    }
    //console.log(meteoX, meteoY, xPos, yPos); 
    for (var j = 0; j < meteoX.length; j++) {
      //console.log(Math.floor(meteoX[j]*size),Math.floor(meteoY[j]*size), Math.floor(xPos[counter]), Math.floor(yPos[counter]));
      if (Math.floor(xPos[counter]) === Math.floor(meteoX[j] * size) && Math.floor(yPos[counter]) === Math.floor(meteoY[j] * size)) {
        alertMeteo(j);
      }
    }
    counter++;
    if (counter === yPos.length) {
      counter = counter - 1;
      clearInterval(doGo);
    }
    if (meteoCount === 3 && xPos[counter] === 0 && yPos[counter] === 0) {
      final();
    }

  }, interval);

}


function Go2() {

  //counter = 0;
  interval = 500;


  Grid();
  Obstacles();
  Meteors();

  image(roboBase, 0, 0, size, size);

  counter++;

  image(robot, xPos[counter] + size * 0.05, yPos[counter] + size * 0.05, size - size * 0.1, size - size * 0.1);

  if (counter >= yPos.length) {
    counter = counter - 1;
    return;
  }


  for (var i = 0; i < obstacleX.length; i++) {

    if (xPos[counter] === obstacleX[i] * size && yPos[counter] === obstacleY[i] * size || xPos[counter] < 0 || xPos[counter] > width || yPos[counter] < 0 || yPos[counter] > height) {
      alertRock();
      return;
    }
  }

  for (var j = 0; j < meteoX.length; j++) {
    //console.log(Math.floor(xPos[counter]), Math.floor(yPos[counter]), Math.floor(meteoX[j] * size), Math.floor(meteoY[j] * size));
    if (Math.floor(xPos[counter]) === Math.floor(meteoX[j] * size) && Math.floor(yPos[counter]) === Math.floor(meteoY[j] * size)) {
      interval = 5000;
      alertMeteo(j);
    }

    if (meteoCount === 3 && xPos[counter] === 0 && yPos[counter] === 0) {
      final();
      return;
    }
  }

  Go2TimerID = setTimeout(Go2, interval);
}


//function to reset the interval in Go function
function clearGo() {
  clearInterval(doGo);
}

//function to show the routeArray 
function route() {
  noStroke();
  fill(254);
  rect(0, height - size * 2, width, height - size * 2);
  fill(100);
  textSize(font);
  text('Маршрут РОБО: ', 10, height - size * 1.6);
  for (var i = 0; i < routeArray.length; i++) {
    if (i <= 9) {
      text(routeArray[i] + ',', 10 + i * font * 4.3, height - size * 1.6 + font * 1.2);
    } else if (i >= 10 && i <= 19) {
      text(routeArray[i] + ',', 10 + i * font * 4.3 - font * 4.3 * 10, height - size * 1.6 + font * 2.2);
    } else if (i >= 20 && i <= 29) {
      text(routeArray[i] + ',', 10 + i * font * 4.3 - font * 4.3 * 20, height - size * 1.6 + font * 3.2);
    } else if (i >= 30 && i <= 39) {
      text(routeArray[i] + ',', 10 + i * font * 4.3 - font * 4.3 * 30, height - size * 1.6 + font * 4.2);
    } else if (i >= 40) {
      text('Слишком много действий! Не достаточно памяти!', 10, height - size * 1.6 + 70);
    }
  }
  if (meteoCount === 3 && xPos[counter] === 0 && yPos[counter] === 0) {
      return;
    }
}

function Obstacles() {
  for (let i = 0; i < obstaclesNumber; i++) {
    image(obstacle, obstacleX[i] * size, obstacleY[i] * size, size, size);
  }
}

function mouseReleased() {
  fill(230);
  image(btnRight, width - 2 * size, 0, size * 2, size);
  if (mouseX < width && mouseX > width - 2 * size && mouseY > 0 && mouseY < size) {
    Right();
  }
  image(btnLeft, width - 2 * size, size, size * 2, size);
  if (mouseX < width && mouseX > width - 2 * size && mouseY > size && mouseY < size * 2) {
    Left();
  }
  image(btnUp, width - 2 * size, size * 2, size * 2, size);
  if (mouseX < width && mouseX > width - 2 * size && mouseY > size * 2 && mouseY < size * 3) {
    Up();
  }
  image(btnDown, width - 2 * size, size * 3, size * 2, size);
  if (mouseX < width && mouseX > width - 2 * size && mouseY > size * 3 && mouseY < size * 4) {
    Down();
  }
  image(btnRemove, width - 2 * size, size * 4, size * 2, size);
  if (mouseX < width && mouseX > width - 2 * size && mouseY > size * 4 && mouseY < size * 5) {
    Remove();
  }
  image(btnGo, width - 2 * size, size * 5, size * 2, size);
  if (mouseX < width && mouseX > width - 2 * size && mouseY > size * 5 && mouseY < size * 6) {
    clearTimeout(Go2TimerID);
    counter = 0;
    meteoCount = 0;
    Go2();
  }
  if (mouseX < width && mouseX > width - 2 * size && mouseY > size * 6 && mouseY < size * 7) {
    redDotState = false;
    //console.log(meteorVisible);
  }


}

function alertRock() {
  image(roboAlert, width / 2 - 3.5 * size, height / 2 - 2.25 * size, width / 2, height / 4);
}

function Meteors() {
  for (let i = 0; i < meteoNumber; i++) {
    image(meteor, meteoX[i] * size + size * 0.1, meteoY[i] * size, size * 0.8, size * 0.8);
  }
}

function alertMeteo(num) {

  image(meteoFactsArray[num], size, size, width - size * 4, height - size * 4);
  meteoCount++;
  //console.log(meteoCount);
}

function randomNumbersX() {
  for (var i = 0; i < width / size - 2; i++) {
    randomNumbersArrayX[i] = i;
  }
  randomNumbersArrayX = shuffle(randomNumbersArrayX);
}

function randomNumbersY() {
  for (var j = 0; j < height / size - 2; j++) {
    randomNumbersArrayY[j] = j;
  }
  randomNumbersArrayY = shuffle(randomNumbersArrayY);
}

function final() {

  image(finalImage, size, size, width - size * 4, height - size * 4);

  return;
}