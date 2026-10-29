$(document).ready(function() {
    $('#QFC').on('click', function() {
        fetchAndProcessQuantumGraph();
    });
});

function fetchAndProcessQuantumGraph() {
    fetch('https://Selapian--2f58e6388fb311f1b0781607ee4eb77e.web.val.run')
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            // Extract the integer from the .number property
            console.log(graph);
            const qIndex = parseInt(data.number, 10) || 0;

            // Ensure graph data is loaded
            if (typeof graph === 'undefined' || !graph.nodes || !graph.rels) {
                console.error('Graph data not found.');
                return;
            }

            // 1. Build Adjacency List from graph.rels
            const adj = {};
            graph.nodes.forEach(n => { adj[n.index] = []; });
            graph.rels.forEach(r => {
                if (adj[r.start] && adj[r.end]) {
                    adj[r.start].push(r.end);
                    adj[r.end].push(r.start); // Undirected connection for pathfinding
                }
            });

            // 2. Determine start and target nodes using the quantum index (0-255)
            const startIndex = graph.nodes[0].index;
            const targetNodeIndex = qIndex % graph.nodes.length;
            const targetIndex = graph.nodes[targetNodeIndex].index;

            // 3. Shortest Path Algorithm (BFS)
            const queue = [[startIndex]];
            const visited = new Set([startIndex]);
            let shortestPath = [startIndex];

            while (queue.length > 0) {
                const path = queue.shift();
                const currentNode = path[path.length - 1];

                if (currentNode === targetIndex) {
                    shortestPath = path;
                    break;
                }

                for (const neighbor of (adj[currentNode] || [])) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push([...path, neighbor]);
                    }
                }
            }

            // 4. Select node along the shortest path using the quantum index
            const selectedKey = shortestPath[qIndex % shortestPath.length] || targetIndex;
            const node = graph.nodes.find(n => n.index === selectedKey) || graph.nodes[targetNodeIndex];

            // 5. Update DOM elements
            $('#myriad').html(node.quotation);
            $('#myraid_src').html(node.src);
            $("#myriad, #myriad_src").fadeIn();        
        })
        .catch(err => {
            console.error('Failed to fetch quantum index:', err);
            // Fallback to first node if offline/error
            const fallbackNode = graph.nodes[0];
            $('#myriad').html(fallbackNode.quotation);
            $('#myraid_src').html(fallbackNode.src);
        });
}
