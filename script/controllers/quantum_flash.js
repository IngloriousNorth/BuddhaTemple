import MVC from '../../lib/MAINFRAME.js';
import TEMPEST from '../../lib/TEMPEST.js';
import QuantumFlash from '../../script/models/quantum_flash.js'; // Adjust path as needed

let intervalId = null;
let currentNodeIndex = undefined;

const initialize = function(index = undefined) {
    const graph = MVC.Model.quotationGraph.graph;
    var node = graph.nodes.find(n => n.index === index);
    
    if (!node && graph.nodes.length > 0) {
        node = graph.nodes[0]; 
    }

    if (!node) {
        TEMPEST.route("");
        return;
    } else {
        currentNodeIndex = node.index;
        renderNode(node);
    }

    // Clear any existing interval to prevent stacking multiple timers
    if (intervalId) clearInterval(intervalId);

    // Set up the interval rotation (e.g., every 15-20 seconds)
    intervalId = setInterval(async function() {
        await rotateFlashCard();
    }, 15000);
}

const rotateFlashCard = async function() {
    const graph = MVC.Model.quotationGraph.graph;
    if (!graph || !graph.nodes || !graph.rels) return;

    // 1. Get next quantum index from our bulk buffer (zero API spam)
    const qIndex = await QuantumFlash.getNextQuantumIndex();

    // 2. Determine active menu / page overlap constraint from TEMPEST route parameters
    const params = TEMPEST.paramREC();
    const currentPath = params ? params.path : undefined;
    const currentPage = TEMPEST.pageREC();

    // Collect valid node indexes constrained by page overlap (the menu filter)
    const allowedNodeIndexes = new Set();
    graph.rels.forEach(function(rel) {
        // Check if relationship overlaps with the current menu/page filter
        const matchesPage = currentPath && rel.pages && rel.pages.indexOf(currentPath) > -1;
        const matchesGeneralPage = !currentPath && rel.pages && rel.pages.indexOf(currentPage) > -1;
        
        if (matchesPage || matchesGeneralPage || !rel.pages) {
            allowedNodeIndexes.add(rel.start);
            allowedNodeIndexes.add(rel.end);
        }
    });

    // 3. Build Adjacency List from graph.rels (Edge Connections)
    const adj = {};
    graph.nodes.forEach(n => { 
        // Only include nodes permitted by the menu overlap constraint if any exist
        if (allowedNodeIndexes.size === 0 || allowedNodeIndexes.has(n.index)) {
            adj[n.index] = []; 
        }
    });

    graph.rels.forEach(r => {
        if (adj[r.start] && adj[r.end]) {
            adj[r.start].push(r.end);
            adj[r.end].push(r.start); 
        }
    });

    // 4. Determine starting node key
    let startNodeKey = currentNodeIndex;
    const validNodeKeys = Object.keys(adj);
    
    if (startNodeKey === undefined || !adj[startNodeKey]) {
        if (validNodeKeys.length > 0) {
            const startIndex = Math.abs(qIndex) % validNodeKeys.length;
            startNodeKey = validNodeKeys[startIndex];
        } else {
            startNodeKey = graph.nodes[0].index;
        }
    }

    // 5. 2-Hop Recommendation Algorithm constrained to the menu/page neighborhood
    const hop1 = new Set();
    let arr = [];

    (adj[startNodeKey] || []).forEach(neighbor => {
        hop1.add(neighbor);
    });

    hop1.forEach(neighborKey => {
        (adj[neighborKey] || []).forEach(secondHopKey => {
            if (secondHopKey !== startNodeKey && !hop1.has(secondHopKey) && adj[secondHopKey]) {
                if (!arr.includes(secondHopKey)) {
                    arr.push(secondHopKey);
                }
            }
        });
    });

    // Fallback if 2-hop array is empty within this menu scope
    if (arr.length === 0) {
        arr = Array.from(hop1);
        if (arr.length === 0) {
            arr = validNodeKeys.length > 0 ? validNodeKeys : graph.nodes.map(n => n.index);
        }
    }

    // Sort array by node edge count descending (prioritizing highly connected nodes within the menu topic)
    arr.sort((keyA, keyB) => {
        const edgesA = (adj[keyA] || []).length;
        const edgesB = (adj[keyB] || []).length;
        return edgesB - edgesA;
    });

    // 6. Select target node using your exact formula: arr[QRNG % arr.length]
    const targetKey = arr[Math.abs(qIndex) % arr.length];
    const node = graph.nodes.find(n => n.index === targetKey) || graph.nodes[0];

    if (node) {
        currentNodeIndex = node.index;
        TEMPEST.paramSET({"index" : node.index});
        renderNode(node);
    }
}

// Helper to render quotation with fade transition and dynamic quote spans for ::first-letter styling
const renderNode = function(node) {
    $('.quotation, .src').fadeOut(150, function() {
        $('.quotation').html(node.quotation);
        $('.src').html(" -- " + node.src);
        
        // Wrap with quote spans so ::first-letter targets actual letters instead of '"'
        $('.quotation').prepend(`<span class='quot' id='up'>"</span>`);
        $('.quotation').append(`<span id='down' class='quot'>"</span>`);
        
        $('.quotation, .src').fadeIn(200);
    });
}

// Delegated manual click trigger for #QFC button
$(document).on('click', '#QFC', async function(e) {
    e.preventDefault();
    await rotateFlashCard();
});

export default { initialize };