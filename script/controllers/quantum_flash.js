$(document).ready(function() {
    let currentPath = [];
    let stepIndex = 0;

    $('#QFC').on('click', function() {
        // If we need a new path or finished the current one, fetch a fresh quantum index
        if (currentPath.length === 0 || stepIndex >= currentPath.length) {
            fetch('https://Selapian--2f58e6388fb311f1b0781607ee4eb77e.web.val.run')
                .then(response => response.json())
                .then(data => {
                    const qIndex = parseInt(data.number, 10) || 0;

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
                            adj[r.end].push(r.start);
                        }
                    });

                    // 2. Determine start and target nodes using quantum index
                    const startIndex = graph.nodes[0].index;
                    const targetNodeIndex = qIndex % graph.nodes.length;
                    const targetIndex = graph.nodes[targetNodeIndex].index;

                    // 3. Shortest Path (BFS)
                    const queue = [[startIndex]];
                    const visited = new Set([startIndex]);
                    currentPath = [startIndex];

                    while (queue.length > 0) {
                        const path = queue.shift();
                        const currentNode = path[path.length - 1];

                        if (currentNode === targetIndex) {
                            currentPath = path;
                            break;
                        }

                        for (const neighbor of (adj[currentNode] || [])) {
                            if (!visited.has(neighbor)) {
                                visited.add(neighbor);
                                queue.push([...path, neighbor]);
                            }
                        }
                    }

                    stepIndex = 0;
                    transitionAndDisplay();
                })
                .catch(err => {
                    console.error('Failed to fetch quantum index:', err);
                    const fallbackNode = graph.nodes[0];
                    $('#myriad').html(fallbackNode.quotation);
                    $('#myraid_src').html(fallbackNode.src);
                });
        } else {
            // Cycle to the next node in the existing path on subsequent clicks
            transitionAndDisplay();
        }
    });

    function transitionAndDisplay() {
        if (currentPath.length === 0) return;

        const nodeKey = currentPath[stepIndex];
        const node = graph.nodes.find(n => n.index === nodeKey);

        if (node) {
            // Fade out, update content while hidden, then fade in
            $('#myriad, #myraid_src').fadeOut(150, function() {
                $('#myriad').html(node.quotation);
                $('#myraid_src').html(node.src);
                $('#myriad, #myraid_src').fadeIn(200);
            });
        }

        // Advance step, looping back if we reach the end of the shortest path
        stepIndex = (stepIndex + 1) % currentPath.length;
    }
});
