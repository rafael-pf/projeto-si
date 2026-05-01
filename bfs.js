// BFS (Breadth-First Search) implementation
// Extends SearchAlgorithm to provide pathfinding using BFS

class BFS extends SearchAlgorithm {
  constructor(grid, obstacles, gridSize) {
    super(grid, obstacles, gridSize);
  }

  search(start, goal) {
    // Reset state
    this.visited = [];
    this.frontier = [start];
    let cameFrom = {};
    cameFrom[`${start.x},${start.y}`] = null;

    const reconstructPath = () => {
      this.path = this.reconstructPath(goal, cameFrom);
      this.pathVis = this.path.slice(); // copy the path for visualization
    };

    const step = () => {
      if (this.frontier.length === 0) {
        // Goal not found, but still reconstruct if we have a path
        if (this.path === null) {
          this.path = [];
          this.pathVis = [];
        }
        return;
      }

      let current = this.frontier.shift();

      if (current.x === goal.x && current.y === goal.y) {
        reconstructPath();
        return;
      }

      this.visited.push(current);

      let neighbors = this.getNeighbors(current);
      for (let next of neighbors) {
        if (!cameFrom.hasOwnProperty(`${next.x},${next.y}`)) {
          this.frontier.push(next);
          cameFrom[`${next.x},${next.y}`] = current;
        }
      }

      // Continue searching asynchronously
      setTimeout(step, this.searchDelay);
    };

    step();
  }
}
