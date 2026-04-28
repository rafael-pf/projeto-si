// Seeking a Target (Seek)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/p1Ws1ZhG36g
// https://thecodingtrain.com/learning/nature-of-code/5.2-seek.html

// Seek: https://editor.p5js.org/codingtrain/sketches/AxuChwlgb
// Seek with Sliders: https://editor.p5js.org/codingtrain/sketches/DROTtSI7J
// Arrive: https://editor.p5js.org/codingtrain/sketches/dQx9oOfTN
// Pursue: https://editor.p5js.org/codingtrain/sketches/XbsgoU_of

let imgVeiculo;
let imgComida;
let vehicle;
let target;
let counter;
let gridSize = 50;
let grid = [];
let obstacles = [];
let OBSTACLES_NUMBER = 30;
let food;
let mudFields = [];
let MUD_FIELDS_NUMBER = 10;
let waterFields = [];
let WATER_FIELDS_NUMBER = 10;

function preload() {
  imgVeiculo = loadImage('car.png');
  imgComida = loadImage('apple.png'); 
}

function drawGrid() {
    for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
            stroke(255, 3);
            line(x, 0, x, height);
            line(0, y, width, y);
        }
    }
}

// function to generate grid points
function generateGrid() {
    grid = [];
    for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
            grid.push({
                pos: createVector(x, y),
                tag: 0
            });
        }
    }
}

// function to generate a obstacle
function generateObstacle() {
    let obstacle = {
        x: Math.floor(Math.random() * width / gridSize) * gridSize,
        y: Math.floor(Math.random() * height / gridSize) * gridSize,
        width: gridSize * Math.floor(Math.random() * 2 + 2),
        height: gridSize * Math.floor(Math.random() * 2 + 2)
    }

    // mark the grid points that are inside the obstacle
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].pos.x >= obstacle.x && grid[i].pos.x < obstacle.x + obstacle.width &&
            grid[i].pos.y >= obstacle.y && grid[i].pos.y < obstacle.y + obstacle.height) {
            grid[i].tag = 1;
        }
    }

    return obstacle;
}

//function to generate terrain
function generateTerrain(tag) {
    let terrain = {
        x: Math.floor(Math.random() * width / gridSize) * gridSize,
        y: Math.floor(Math.random() * height / gridSize) * gridSize,
        width: gridSize * Math.floor(Math.random() * 4 + 3),
        height: gridSize * Math.floor(Math.random() * 4 + 3)
    }

    // mark the grid points that are inside the terrain
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].pos.x >= terrain.x && grid[i].pos.x < terrain.x + terrain.width &&
            grid[i].pos.y >= terrain.y && grid[i].pos.y < terrain.y + terrain.height) {
            grid[i].tag = tag;
        }
    }

    return terrain;
}

// function to generate a object
function generateObject() {
    let object = {
        x: Math.floor(Math.random() * width / gridSize) * gridSize,
        y: Math.floor(Math.random() * height / gridSize) * gridSize,
        width: gridSize,
        height: gridSize
    }

    return object;
}

// function to draw a object
function drawRect(object, color) {
    fill(color);
    noStroke();

    rect(object.x, object.y, object.width, object.height);
}

// function to generate a food
function generateFood() {
    let food = generateObject();

    // check if the food is inside the obstacle
    for (let i = 0; i < OBSTACLES_NUMBER; i++) {
        if (food.x >= obstacles[i].x && food.x < obstacles[i].x + obstacles[i].width &&
            food.y >= obstacles[i].y && food.y < obstacles[i].y + obstacles[i].height) {
            food = generateObject();
            i = -1;
        }
    }

    return food;
}

function setup() {
    // full screen
    createCanvas(windowWidth, windowHeight);
    generateGrid();
    for (let i = 0; i < OBSTACLES_NUMBER; i++) {
        obstacles.push(generateObstacle());
    }
    for (let i = 0; i < MUD_FIELDS_NUMBER; i++) {
        mudFields.push(generateTerrain(2));
    }
    for (let i = 0; i < WATER_FIELDS_NUMBER; i++) {
        waterFields.push(generateTerrain(3));
    }
    food = generateFood();
    vehicle = new Vehicle(obstacles, grid, gridSize);
    vehicle.seek(food);
    counter = 0;
}

function draw() {
    background('#F2D16B');
    for (let i = 0; i < obstacles.length; i++) {
      drawRect(obstacles[i], '#333333');
    }

    for (let i = 0; i < mudFields.length; i++) {
      drawRect(mudFields[i], '#765432');
    }
    for (let i = 0; i < waterFields.length; i++) {
      drawRect(waterFields[i], '#4A90E2');
    }
    image(imgComida, food.x, food.y, gridSize, gridSize);

    drawGrid();

    // vehicle.seek(target);
    vehicle.update();
    vehicle.show();
}
