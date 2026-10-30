import MVC from '../../lib/MAINFRAME.js';
import TEMPLAR from '../../lib/TEMPLAR.js';

let currentNodeIndex = undefined;

const initialize = function(index = undefined){
    const graph = MVC.Model.quotationGraph.graph;
    var node = graph.nodes.find(n => n.index === index);
    
    if(!node && graph.nodes.length > 0){
        node = graph.nodes[0]; // Default to first node if none specified
    }

    if(!node){
        MVC.View.homeV.initialize();
    }
    else{
        currentNodeIndex = node.index;
        $("#myriad").html(node.quotation);
        $("#myriad_src").html(" -- " + node.src);    
    }
}

const QRNG = function(providedStartKey = null) {
    fetch('https://Selapian--2f58e6388fb311f1b0781607ee4eb77e.web.val.run')
        .then(response => response.json())
        .then(data => {
            const qIndex = parseInt(data.number, 10) || 0;
            const graph = MVC.Model.quotationGraph.graph;

            if (!graph || !graph.nodes) return;

            // 1. Build Adjacency List from graph.rels
            const adj = {};
            graph.nodes.forEach(n => { adj[n.index] = []; });
            if (graph.rels) {
                graph.rels.forEach(r => {
                    if (adj[r.start] && adj[r.end]) {
                        adj[r.start].push(r.end);
                        adj[r.end].push(r.start); // Undirected connection graph
                    }
                });
            }

            // 2. Determine starting node: use module-scoped currentNodeIndex or fallback
            let startNodeKey = providedStartKey !== undefined ? providedStartKey : currentNodeIndex;
            if (startNodeKey === undefined || !graph.nodes.some(n => n.index === startNodeKey)) {
                const startIndex = Math.abs(qIndex) % graph.nodes.length;
                startNodeKey = graph.nodes[startIndex].index;
            }

            // 3. 2-Hop Recommendation Algorithm to build the target array (arr)
            const hop1 = new Set();
            let arr = [];

            // Find 1-hop neighbors
            (adj[startNodeKey] || []).forEach(neighbor => {
                hop1.add(neighbor);
            });

            // Find 2-hop neighbors (friends of friends)
            hop1.forEach(neighborKey => {
                (adj[neighborKey] || []).forEach(secondHopKey => {
                    if (secondHopKey !== startNodeKey && !hop1.has(secondHopKey)) {
                        if (!arr.includes(secondHopKey)) {
                            arr.push(secondHopKey);
                        }
                    }
                });
            });

            // Fallback to 1-hop or all nodes if the 2-hop array is empty
            if (arr.length === 0) {
                arr = Array.from(hop1);
                if (arr.length === 0) {
                    arr = graph.nodes.map(n => n.index);
                }
            }

            // 4. Select node using your array formula
            const targetKey = arr[Math.abs(qIndex) % arr.length];
            const node = graph.nodes.find(n => n.index === targetKey) || graph.nodes[0];

            if (node) {
                currentNodeIndex = node.index;
                TEMPEST.paramSET({"index" : node.index});
                
                $('#myriad, #myriad_src').fadeOut(150, function() {
                    $('#myriad').html(node.quotation);
                    $('#myriad_src').html(" -- " + node.src);
                    $('#myriad, #myriad_src').fadeIn(200);
                });
            }
        })
        .catch(err => {
            console.log("PSEUDO-RANDOM FALLBACK");
            console.error('Failed to fetch quantum index:', err);
            
            const graph = MVC.Model.quotationGraph.graph;
            if (graph && graph.nodes && graph.nodes.length > 0) {
                // Local Math.random() fallback selection
                const randomIndex = Math.floor(Math.random() * graph.nodes.length);
                const fallbackNode = graph.nodes[randomIndex];
                
                currentNodeIndex = fallbackNode.index;
                TEMPEST.paramSET({"index" : fallbackNode.index});

                $('#myriad, #myriad_src').fadeOut(150, function() {
                    $('#myriad').html(fallbackNode.quotation);
                    $('#myriad_src').html(" -- " + fallbackNode.src);
                    $('#myriad, #myriad_src').fadeIn(200);
                });
            }
        });
}

// Delegated event listener ensures button clicks are always caught across renders
$(document).on('click', '#QFC', function(e) {
    e.preventDefault();
    QRNG(currentNodeIndex);
});

export default { initialize };