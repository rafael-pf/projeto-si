class SearchAlgorithm {
  constructor(grid, obstacles, gridSize) {
    this.grid = grid;
    this.obstacles = obstacles;
    this.gridSize = gridSize;
    this.searchDelay = 20;
    this.visited = [];
    this.frontier = [];
    this.path = null;
    this.pathVis = null;
  }

  setSearchDelay(delay) {
    this.searchDelay = delay;
  }

  getNeighbors(current) {
    let neighbors = [];
    let directions = [
      createVector(0, -this.gridSize),
      createVector(this.gridSize, 0),
      createVector(0, this.gridSize),
      createVector(-this.gridSize, 0),
    ];

    for (let i = 0; i < directions.length; i++) {
      let neighbor = p5.Vector.add(current, directions[i]);
      if (
        neighbor.x >= 0 &&
        neighbor.x < width &&
        neighbor.y >= 0 &&
        neighbor.y < height
      ) {
        let isObstacle = false;
        for (let j = 0; j < this.obstacles.length; j++) {
          if (
            neighbor.x >= this.obstacles[j].x &&
            neighbor.x < this.obstacles[j].x + this.obstacles[j].width &&
            neighbor.y >= this.obstacles[j].y &&
            neighbor.y < this.obstacles[j].y + this.obstacles[j].height
          ) {
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

  search(start, goal) {
    throw new Error("search() method must be implemented by subclass");
  }

  getCost(a, b) {
    let index = this.grid.findIndex(
      (g) => g.pos.x === b.x && g.pos.y === b.y
    );

    if (index === -1) {
      return Infinity; // evita quebrar a busca
    }

    let tag = this.grid[index].tag;

    if (tag === 0) {
      return 1; // custo padrão para terreno normal
    } else if (tag === 1) {
      return Infinity; // obstáculo, custo infinito
    } else if (tag === 2) {
      return 2; // lama, custo maior
    } else if (tag === 3) {
      return 4; // água, custo ainda maior
    } else {
      return 1; // custo padrão para qualquer outro tipo de terreno
    }
  }

  heuristic(start, goal) {
    return abs(start.x - goal.x) + abs(start.y - goal.y);
  }

  reconstructPath(goal, cameFrom) {
    let path = [];
    let current = goal;
    while (current != null) {
      path.push(current);
      current = cameFrom[`${current.x},${current.y}`];
    }
    return path.reverse();
  }

  getPath() {
    return this.path;
  }

  getPathVis() {
    return this.pathVis;
  }

  getVisited() {
    return this.visited;
  }

  getFrontier() {
    return this.frontier;
  }
}
