// Seeking a Target (Seek)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/p1Ws1ZhG36g
// https://thecodingtrain.com/learning/nature-of-code/5.2-seek.html

// Seek: https://editor.p5js.org/codingtrain/sketches/AxuChwlgb
// Seek with Sliders: https://editor.p5js.org/codingtrain/sketches/DROTtSI7J
// Arrive: https://editor.p5js.org/codingtrain/sketches/dQx9oOfTN
// Pursue: https://editor.p5js.org/codingtrain/sketches/XbsgoU_of

class Vehicle {
    constructor(obstacles, grid, gridSize, searchAlgorithm = null) {
        // generate random position

        let x = Math.floor(Math.random() * width / gridSize) * gridSize;
        let y = Math.floor(Math.random() * height / gridSize) * gridSize;

        for (let i = 0; i < obstacles.length; i++) {
            if (x >= obstacles[i].x && x < obstacles[i].x + obstacles[i].width &&
                y >= obstacles[i].y && y < obstacles[i].y + obstacles[i].height) {
                x = Math.floor(Math.random() * width / gridSize) * gridSize;
                y = Math.floor(Math.random() * height / gridSize) * gridSize;
                i = -1;
            }
        }

        this.grid = grid;
        this.obstacles = obstacles;
        this.gridSize = gridSize;
        this.path = null;
        this.pathVis = null;
        this.pathIndex = 0;
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.pointer = createVector(x + 50, y + 20)
        this.maxSpeed = 4;
        this.maxForce = 0.25;
        this.size = gridSize;
        this.r = 16;
        this.searchRadius = 150;
        
        // Set search algorithm (BFS by default)
        this.searchAlgorithm = searchAlgorithm || new BFS(grid, obstacles, gridSize);
    }

    // Set a new search algorithm
    setSearchAlgorithm(algorithm) {
        this.searchAlgorithm = algorithm;
    }

    // Initiate pathfinding to target
    findPath(target) {
        this.searchAlgorithm.search(this.pos, target);
        this.path = null;
        this.pathVis = null;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        // Update path from search algorithm
        if (this.path === null && this.searchAlgorithm.getPath() !== null) {
            this.path = this.searchAlgorithm.getPath();
            this.pathVis = this.searchAlgorithm.getPathVis();
        }

        if (this.path && this.path.length > 1) {
            let target = this.path[1];

            let multiplier = 1;

            let index = this.grid.findIndex(g => g.pos.x === target.x && g.pos.y === target.y);

            if (this.grid[index].tag === 2) {//mud
                multiplier = 0.5;
            }
            if (this.grid[index].tag === 3) {//water
                multiplier = 0.25;
            }

            if (this.pos.x !== target.x) {
                if (abs(this.pos.x - target.x) < this.maxSpeed * multiplier) {
                    this.pos.x = target.x;
                } else {
                    this.pos.x += (target.x > this.pos.x) ? this.maxSpeed * multiplier : -this.maxSpeed * multiplier;
                }
            } 
            else if (this.pos.y !== target.y) {
                if (abs(this.pos.y - target.y) < this.maxSpeed * multiplier) {
                    this.pos.y = target.y;
                } else {
                    this.pos.y += (target.y > this.pos.y) ? this.maxSpeed * multiplier : -this.maxSpeed * multiplier;
                }
            }

            if (this.pos.x === target.x && this.pos.y === target.y) {
                this.path.shift();
            }
        }
    }

    show() {
        // Get visualization data from search algorithm
        let visited = this.searchAlgorithm.getVisited();
        let frontier = this.searchAlgorithm.getFrontier();

        // print visited
        fill(0, 150);
        for (let i = 0; i < visited.length; i++) {
            square(visited[i].x, visited[i].y, this.size);
        }

        // print frontier
        stroke(0, 255, 0);
        fill(0, 150);
        for (let i = 0; i < frontier.length; i++) {
            square(frontier[i].x, frontier[i].y, this.size);
        }

        // print path
        noStroke();
        fill(255, 255, 255, 128);
        if (this.pathVis != null) {
            for (let i = 1; i < this.pathVis.length - 1; i++) {
                square(this.pathVis[i].x, this.pathVis[i].y, this.size);
            }
        }

        image(imgVeiculo, this.pos.x, this.pos.y, this.size, this.size);
    }

}
