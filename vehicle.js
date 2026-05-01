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
        this.pathVis = null;
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
                this.pathVis = this.path.slice(); // copy the path for visualization
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


    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {

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
        // print visited
        fill(0, 150);
        for (let i = 0; i < this.visited.length; i++) {
            square(this.visited[i].x, this.visited[i].y, this.size);
        }

        // print frontier
        stroke(0, 255, 0);
        fill(0, 150);
        for (let i = 0; i < this.frontier.length; i++) {
            square(this.frontier[i].x, this.frontier[i].y, this.size);
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
