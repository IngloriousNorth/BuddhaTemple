$(document).ready(function() {
    $('#QFC').on('click', function() {
        fetch('https://Selapian--2f58e6388fb311f1b0781607ee4eb77e.web.val.run')
            .then(response => response.json())
            .then(data => {
                console.log(data.number);
                const qIndex = parseInt(data.number, 10) || 0;

                if (typeof graph === 'undefined' || !graph.nodes || graph.nodes.length === 0) {
                    console.error('Graph nodes not found.');
                    return;
                }

                // Pure random/quantum index selection using your array formula
                const nodeIndex = Math.abs(qIndex) % graph.nodes.length;
                const node = graph.nodes[nodeIndex];

                if (node) {
                    // Fade out, update content, then fade in for the flash card effect
                    $('#myriad, #myraid_src').fadeOut(150, function() {
                        $('#myriad').html(node.quotation);
                        $('#myraid_src').html(node.src);
                        $('#myriad, #myraid_src').fadeIn(200);
                    });
                }
            })
            .catch(err => {
                console.error('Failed to fetch quantum index:', err);
                const fallbackNode = graph.nodes[0];
                $('#myriad').html(fallbackNode.quotation);
                $('#myraid_src').html(fallbackNode.src);
            });
    });
});
