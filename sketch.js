// Seeking a Target (Seek)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/p1Ws1ZhG36g
// https://thecodingtrain.com/learning/nature-of-code/5.2-seek.html

// Seek: https://editor.p5js.org/codingtrain/sketches/AxuChwlgb
// Seek with Sliders: https://editor.p5js.org/codingtrain/sketches/DROTtSI7J
// Arrive: https://editor.p5js.org/codingtrain/sketches/dQx9oOfTN
// Pursue: https://editor.p5js.org/codingtrain/sketches/XbsgoU_of

let vehicle;
let target;
let counter;
let gridSize = 50;
let grid = [];
let obstacles = [];
let OBSTACLES_NUMBER = 3;
let food;
let mudField = {};
let waterField = {};


function checkColision() {
    distance = Math.sqrt((posX - vehicle.pos.x) ** 2 + (posY - vehicle.pos.y) ** 2);


    if (distance < 2) {
        counter++;
        posX = Math.floor(Math.random() * 501);
        posY = Math.floor(Math.random() * 501);
        target = createVector(posX, posY);
    }
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
        x: Math.floor(Math.random() * width / 50) * 50,
        y: Math.floor(Math.random() * height / 50) * 50,
        width: 50 * Math.floor(Math.random() * 2 + 2),
        height: 50 * Math.floor(Math.random() * 2 + 2)
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
        x: Math.floor(Math.random() * width / 50) * 50,
        y: Math.floor(Math.random() * height / 50) * 50,
        width: 50 * Math.floor(Math.random() * 4 + 3),
        height: 50 * Math.floor(Math.random() * 4 + 3)
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
        x: Math.floor(Math.random() * width / 50) * 50,
        y: Math.floor(Math.random() * height / 50) * 50,
        width: 50,
        height: 50
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
    food = generateFood();
    mudField = generateTerrain(2);
    waterField = generateTerrain(3);
    vehicle = new Vehicle(obstacles);
    counter = 0;
}

function draw() {
    background(0);

    for (let i = 0; i < obstacles.length; i++) {
        drawRect(obstacles[i], '#808080');
    }
    drawRect(food, '#FFD700');
    drawRect(mudField, '#765432');
    drawRect(waterField, '#4A90E2');
    drawGrid();

    // vehicle.seek(target);
    vehicle.update();
    vehicle.show();

}
