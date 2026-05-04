class AStar extends SearchAlgorithm {
    constructor(grid, obstacles, gridSize) {
        super(grid, obstacles, gridSize);
    }

    search(start, goal) {
        this.visited = [];
        this.frontier = new PriorityQueue();
        this.path = null;
        this.pathVis = [];

        let cameFrom = {};
        let costSoFar = {};
        let priority;

        let startKey = `${start.x},${start.y}`;

        this.frontier.enqueue(start, 0);
        cameFrom[startKey] = null;
        costSoFar[startKey] = 0;

        const reconstructPath = () => {
            this.path = this.reconstructPath(goal, cameFrom);
            this.pathVis = [...this.path];
        };

        const step = () => {
            if (this.frontier.isEmpty()) {
                this.path = [];
                this.pathVis = [];
                return;
            }

            let current = this.frontier.dequeue();
            let currentKey = `${current.x},${current.y}`;

            if (this.visited.some(v => v.x === current.x && v.y === current.y)) {
                setTimeout(step, this.searchDelay);
                return;
            }

            if (current.x === goal.x && current.y === goal.y) {
                reconstructPath();
                return;
            }

            this.visited.push(current);

            let neighbors = this.getNeighbors(current);

            for (let next of neighbors) {
                let nextKey = `${next.x},${next.y}`;

                if (!(currentKey in costSoFar)) continue;

                let newCost = costSoFar[currentKey] + this.getCost(current, next);

                if (!(nextKey in costSoFar) || newCost < costSoFar[nextKey]) {
                    costSoFar[nextKey] = newCost;
                    priority = newCost + this.heuristic(next, goal);
                    this.frontier.enqueue(next, priority);
                    cameFrom[nextKey] = current;
                }
            }

            setTimeout(step, this.searchDelay);
        };

        step();
    }

    getFrontier() {
        return this.frontier.toArray();
    }
}