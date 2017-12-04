let s;

let scale = 50;

let cols;

let rows;

let food;

let timeout;

let limit;

let popSize = 10;

let currentPopulation;

let population = [];

let fitness = [];

let playCount;

let sumFitness;

let gamesEachPopulation = 2;

let bestFitness;

let bestIdx;

function setup () {
    createCanvas(600, 600);
    cols = floor(width / scale);
    rows = floor(height / scale);
    limit = cols * rows * 10;
    initPopulation();
    start();
}

function start () {
    currentPopulation = 0;
    bestFitness = Number.NEGATIVE_INFINITY;
    s = population[ 0 ];
    s.birthtime = frameCount;
    pickFirstFoodLocation();
}

function endGeneration () {
    console.log('MELHOR FITNESS : ' + bestFitness);
    console.log('MELHORES PESOS : ' + population[ bestIdx ].weights);
    console.log('GERANDO NOVA GERAÇÃO...');
    nextGeneration();
    currentPopulation = 0;
    s = population[ currentPopulation ];
}

function nextSnake () {
    if (bestFitness < fitness[ currentPopulation ]) {
        bestFitness = fitness[ currentPopulation ];
        bestIdx = currentPopulation;
    }

    currentPopulation++;
    if (currentPopulation === population.length) {
        endGeneration();
    }
    s = population[ currentPopulation ];
    s.birthtime = frameCount;
    pickFirstFoodLocation();
}

function playAgain () {
    s = new Snake(0, 0, 0, 0, 0, [], population[ currentPopulation ].weights, 0);
    s.birthtime = frameCount;
    pickFirstFoodLocation();
}

function initPopulation () {
    document.getElementById('lifes').textContent = gamesEachPopulation + 1;
    for (let i = 0; i < popSize; i++) {
        let weights = [ random(-1, 0), random(-1, 0), random(-1, 1), random(-1, 0), random(-1, 0) ];
        population.push(new Snake(0, 0, 0, 0, 0, [], weights, 0));
    }
    sumFitness = 0;
    playCount = 0;
}

function pickFirstFoodLocation () {
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scale);
    timeout = frameCount + limit;
}

function pickLocation () {
    let check = true;
    timeout = frameCount + limit;

    while (check) {
        check = false;
        food = createVector(floor(random(cols)), floor(random(rows)));
        food.mult(scale);
        for (let i = 0; i < s.tail.length; i++) {
            if (food.x === s.tail[ i ].x && food.y === s.tail[ i ].y) {
                check = true;
                break;
            }
        }
        if (food.x === s.x && food.y === s.y) {
            check = true;
        }
    }
}

function draw () {
    background(51);
    let eat = s.eat(food);
    document.getElementById('score').textContent = eat.total + 1;
    if (eat.hasEat) {
        pickLocation();
    }
    let noWhereToGo = s.makeMove(s.pickDir());
    s.show();
    fill(255, 0, 100);
    rect(food.x, food.y, scale, scale);
    if (s.death() || noWhereToGo) {
        let roundOver = false;
        document.getElementById('lifes').textContent = gamesEachPopulation - playCount;
        if (playCount === gamesEachPopulation) {
            fitness[ currentPopulation ] = sumFitness / gamesEachPopulation;
            if (fitness[ currentPopulation ] < 0) {
                fitness[ currentPopulation ] = 0;
            }
            document.getElementById('games').textContent = currentPopulation + 1;
            document.getElementById('lifes').textContent = gamesEachPopulation + 1;
            console.log('PERDEU');
            console.log('PESOS: ' + population[ currentPopulation ].weights);
            console.log('FITNESS = ' + fitness[ currentPopulation ].toFixed(3));
            sumFitness = 0;
            playCount = 0;

            roundOver = true;
        }
        else {
            sumFitness += s.tail.length + (frameCount - s.birthtime) / (cols * rows * -1);
            playCount++;
        }
        roundOver ? nextSnake() : playAgain();
    } else if (s.end()) {
        console.log('VENCEU!');
        fitness[ currentPopulation ] = s.tail.length + (frameCount - s.birthtime) / (cols * rows * -0.5);
        console.log('FITNESS = ' + fitness[ currentPopulation ].toFixed(3));
        if (currentPopulation === population.length - 1) {
            endGeneration();
        } else {
            nextSnake();
        }
    }
}
