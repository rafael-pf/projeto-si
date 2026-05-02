class greedySearch extends SearchAlgorithm {
    constructor(grid, obstacles, gridSize) {
        super(grid, obstacles, gridSize);
    }

    search(start, goal) {
        // Reseta o estado
        this.visited = [];
        this.frontier = new PriorityQueue();
        this.frontier.enqueue(start, this.heuristic(start, goal));
        let cameFrom = {};
        cameFrom[`${start.x},${start.y}`] = null;

        const reconstructPath = () => {
            this.path = this.reconstructPath(goal, cameFrom);
            this.pathVis = this.path.slice(); // Copia o caminho para visualização
        };

        const step = () => {
            if (this.frontier.isEmpty()) {
                // Objetivo não encontrado, mas ainda assim reconstrói se tivermos um caminho
                if (this.path === null) {
                    this.path = [];
                    this.pathVis = [];
                }
                return;
            }
            let current = this.frontier.dequeue();

            if (current.x === goal.x && current.y === goal.y) {
                reconstructPath();
                return;
            }
            this.visited.push(current);

            let neighbors = this.getNeighbors(current);
            for (let next of neighbors) {
                if (!cameFrom.hasOwnProperty(`${next.x},${next.y}`)) {
                    this.frontier.enqueue(next, this.heuristic(next, goal));
                    cameFrom[`${next.x},${next.y}`] = current;
                }
            }
            // Continua a busca de forma assíncrona para permitir a visualização
            setTimeout(step, this.searchDelay);
        };

        step();
    }

    // Converte a fronteira de PriorityQueue para array para visualização da busca
    getFrontier() {
        return this.frontier.toArray();
    }
}