let s;
let scale = 50;
let cols;
let rows;
let food;
let timeout;
let limit;
let timeTaken;

let popSize = 100;
let currentPopulation;
let population = [];
let fitness = [];
let bestFitness;
let bestIdx;

function setup() {
  createCanvas(600, 600);
  cols = floor(width/scale);
  rows = floor(height/scale);
  limit = cols*rows;
  // frameRate(5);
  initPopulation();
  start();
}

function start() {
  currentPopulation = 0;
  bestFitness = Number.NEGATIVE_INFINITY;
  s = population[0];
  s.birthtime = frameCount;
  pickFirstFoodLocation();
}

function nextSnake() {
  if (bestFitness < fitness[currentPopulation]) {
    bestFitness = fitness[currentPopulation];
    bestIdx = currentPopulation;
  }

  currentPopulation++;
  s = population[currentPopulation];
  s.birthtime = frameCount;
  pickFirstFoodLocation();
}

function initPopulation() {
  for (let i = 0; i < popSize; i++) {
    let weights = [random(-1, 1), random(-1, 1), random(-1, 1)];
    population.push(new Snake(0, 0, 1, 0, 0, [], weights));
  }
}

function pickFirstFoodLocation() {
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scale);
  timeout = frameCount + limit;
}

function pickLocation() {
  let check = true;
  timeout = frameCount + limit;

  while(check) {
    check = false;
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scale);
    for (let i = 0; i < s.tail.length; i++) {
      if (food.x === s.tail[i].x && food.y === s.tail[i].y) {
        check = true;
        break;
      }
    }
    if (food.x === s.x && food.y === s.y) {
      check = true;
    }
  }
}

function draw() {
  background(51);
  if (currentPopulation === population.length-1) {
    console.log("BEST FITNESS : " + bestFitness);
    console.log("BEST WEIGHTS : " + population[bestIdx].weights);
    console.log("GENERATING NEXT GENERATION...");
    nextGeneration();
    currentPopulation = 0;
    s = population[currentPopulation];
  }

  if (s.eat(food)) {
    pickLocation();
  }
  // s.update();
  s.makeMove(s.pickDir());
  s.show();

  fill(255, 0, 100);

  rect(food.x, food.y, scale, scale);

  if (s.death()) {
    console.log("GAME OVER: " + currentPopulation);
    console.log("LENGTH: " + s.tail.length);
    fitness[currentPopulation] = s.tail.length + (frameCount-s.birthtime)/(cols*rows*-1)
    console.log("Fitness = " + fitness[currentPopulation]);
    nextSnake();
  } else if (s.end()) {
    console.log("GAME COMPLETE: " + currentPopulation);
    fitness[currentPopulation] = s.tail.length + frameCount/(cols*rows*-1)
    console.log("Fitness = " + fitness[currentPopulation]);
    nextSnake();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}