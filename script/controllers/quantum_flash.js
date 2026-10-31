import MVC from '../../lib/MAINFRAME.js';
import TEMPEST from '../../lib/TEMPEST.js';
import QuantumFlash from '../../script/models/quantum_flash.js'; // Adjust path to your model folder

let intervalId = null;
let currentNodeIndex = undefined;

const initialize = async function(index = undefined) {
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
            $('.quotation').fadeOut(150, function() {
            // 1. Set the raw quotation text
            $('.quotation').html(node.quotation);
            
            // 2. Prepend and append the quotation mark spans dynamically
            $('.quotation').prepend(`<span class='quot' id='up'>"</span>`);
            $('.quotation').append(`<span id='down' class='quot'>"</span>`);
            
            // 3. Fade them back in together smoothly
            $('.quotation').fadeIn(150);
        });
    }

    // Clear any existing interval to prevent stacking multiple timers
    if (intervalId) clearInterval(intervalId);

    // Set up the 20-second interval rotation
    intervalId = setInterval(async function() {
        await rotateFlashCard();
    }, 15000);
}

const rotateFlashCard = async function() {
    const graph = MVC.Model.quotationGraph.graph;
    if (!graph || !graph.nodes) return;

    // 1. Get next quantum index from our bulk-managed buffer (zero API spam)
    const qIndex = await QuantumFlash.getNextQuantumIndex();

    // 2. Build Adjacency List from graph.rels
    const adj = {};
    graph.nodes.forEach(n => { adj[n.index] = []; });
    if (graph.rels) {
        graph.rels.forEach(r => {
            if (adj[r.start] && adj[r.end]) {
                adj[r.start].push(r.end);
                adj[r.end].push(r.start); 
            }
        });
    }

    // 3. Determine starting node
    let startNodeKey = currentNodeIndex;
    if (startNodeKey === undefined || !graph.nodes.some(n => n.index === startNodeKey)) {
        const startIndex = Math.abs(qIndex) % graph.nodes.length;
        startNodeKey = graph.nodes[startIndex].index;
    }

    // 4. 2-Hop Recommendation Algorithm
    const hop1 = new Set();
    let arr = [];

    (adj[startNodeKey] || []).forEach(neighbor => {
        hop1.add(neighbor);
    });

    hop1.forEach(neighborKey => {
        (adj[neighborKey] || []).forEach(secondHopKey => {
            if (secondHopKey !== startNodeKey && !hop1.has(secondHopKey)) {
                if (!arr.includes(secondHopKey)) {
                    arr.push(secondHopKey);
                }
            }
        });
    });

    if (arr.length === 0) {
        arr = Array.from(hop1);
        if (arr.length === 0) {
            arr = graph.nodes.map(n => n.index);
        }
    }

    // 5. Select target node and render with fade transition
    const targetKey = arr[Math.abs(qIndex) % arr.length];
    const node = graph.nodes.find(n => n.index === targetKey) || graph.nodes[0];

    if (node) {
        currentNodeIndex = node.index;
        
       $('.quotation').fadeOut(150, function() {
            // 1. Set the raw quotation text
            $('.quotation').html(node.quotation);
            
            // 2. Prepend and append the quotation mark spans dynamically
            $('.quotation').prepend(`<span class='quot' id='up'>"</span>`);
            $('.quotation').append(`<span id='down' class='quot'>"</span>`);
            
            // 3. Fade them back in together smoothly
            $('.quotation').fadeIn(150);
        });
    }
}

// Optional manual trigger button hook if you have one
$(document).on('click', '#QFC', async function(e) {
    e.preventDefault();
    await rotateFlashCard();
});

export default { initialize };