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
    constructor(obstacles, grid, gridSize) {
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
        this.path = null;
        this.visited = [];
        this.frontier = [];
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
    }

    getNeighbors(current) {
        let neighbors = [];
        let directions = [
            createVector(0, -gridSize),
            createVector(gridSize, 0),
            createVector(0, gridSize),
            createVector(-gridSize, 0)
        ];

        for (let i = 0; i < directions.length; i++) {
            let neighbor = p5.Vector.add(current, directions[i]);
            if (neighbor.x >= 0 && neighbor.x < width && neighbor.y >= 0 && neighbor.y < height) {
                // check if the neighbor is not an obstacle
                let isObstacle = false;
                for (let j = 0; j < this.obstacles.length; j++) {
                    if (neighbor.x >= this.obstacles[j].x && neighbor.x < this.obstacles[j].x + this.obstacles[j].width &&
                        neighbor.y >= this.obstacles[j].y && neighbor.y < this.obstacles[j].y + this.obstacles[j].height) {
                        isObstacle = true;
                        break;
                    }
                }
                if (!isObstacle) {
                    neighbors.push(neighbor);
                }
            }
        }

        return neighbors;
    }

    seek(food) {
        // BFS for food search
        let start = this.pos;
        let came_from = {};
        let frontier = [start];
        this.frontier = frontier;
        this.visited = [];
        came_from[`${start.x},${start.y}`] = null;

        const reconstructPath = () => {
            let path = [];
            let current = food;
            while (current != null) {
                path.push(current);
                current = came_from[`${current.x},${current.y}`];
            }
            this.path = path.reverse();
        };

        const step = () => {
            if (frontier.length === 0) {
                reconstructPath();
                return;
            }

            let current = frontier.shift();

            if (current.x === food.x && current.y === food.y) {
                reconstructPath();
                return;
            }

            this.visited.push(current);

            let neighbors = this.getNeighbors(current);
            for (let next of neighbors) {
                if (!came_from.hasOwnProperty(`${next.x},${next.y}`)) {
                    frontier.push(next);
                    came_from[`${next.x},${next.y}`] = current;
                }
            }

            setTimeout(step, 1);
        };

        step();

        // // follow the path
        // if (path.length > 1) {
        //     let target = path[1];
        //     let desired = p5.Vector.sub(target, this.pos);
        //     desired.setMag(this.maxSpeed);
        //     let steer = p5.Vector.sub(desired, this.vel);
        //     steer.limit(this.maxForce);
        //     this.applyForce(steer);
        // }

    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        // this.pointer = createVector(this.pos.x + 50, this.pos.y + 20)
        // this.vel.add(this.acc);
        // this.vel.limit(this.maxSpeed);
        // this.pos.add(this.vel);
        // this.acc.set(0, 0);
        // this.edges();

        // follow the path
        // if (this.path.length > 1) {
        //     let target = path[1];
        //     let desired = p5.Vector.sub(target, this.pos);
        //     desired.setMag(this.maxSpeed);
        //     let steer = p5.Vector.sub(desired, this.vel);
        //     steer.limit(this.maxForce);
        //     this.applyForce(steer);
        // }

        if (this.path != null && this.path.length > 1) {
            let target = this.path[1];
            let desired = p5.Vector.sub(target, this.pos);
            desired.setMag(this.maxSpeed);
            let steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            this.applyForce(steer);

            this.vel.add(this.acc);
            this.vel.limit(this.maxSpeed);
            this.pos.add(this.vel);
            this.acc.set(0, 0);
        }
    }

    show() {
        // print visited
        fill(0, 150);
        for (let i = 0; i < this.visited.length; i++) {
            square(this.visited[i].x, this.visited[i].y, this.size);
        }

        // print frontier
        fill(0, 255, 0, 100);
        for (let i = 0; i < this.frontier.length; i++) {
            square(this.frontier[i].x, this.frontier[i].y, this.size);
        }

        // print path
        fill(255);
        if (this.path != null) {
            for (let i = 1; i < this.path.length - 1; i++) {
                square(this.path[i].x, this.path[i].y, this.size);
            }
        }

        // stroke(255);
        // strokeWeight(2);
        // fill('#FF004D');
        // circle(this.pos.x+25, this.pos.y+25, this.size/2);
        image(imgVeiculo, this.pos.x, this.pos.y, this.size, this.size);

        // pop();
    }

    // edges() {
    //     if (this.pos.x > width + this.r) {
    //         this.pos.x = -this.r;
    //     } else if (this.pos.x < -this.r) {
    //         this.pos.x = width + this.r;
    //     }
    //     if (this.pos.y > height + this.r) {
    //         this.pos.y = -this.r;
    //     } else if (this.pos.y < -this.r) {
    //         this.pos.y = height + this.r;
    //     }
    // }
}
