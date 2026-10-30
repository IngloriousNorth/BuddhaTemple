const unfold = function(){
    const params = ANCHOR.getParams();
    const query = params && params.q ? decodeURIComponent(params.q) : "";
    const resultsContainer = $('.search');
    resultsContainer.empty();

    if (!query) {
        resultsContainer.html('<p style="color: gray;">Type something to search quotations...</p>');
        return;
    }

    if (typeof graph === 'undefined' || !graph.nodes) {
        return;
    }

    try {
        // Build case-insensitive regular expression from input query
        const regex = new RegExp(query, 'i');

        // Filter nodes matching regex on quotation or src
        const matches = graph.nodes.filter(node => 
            regex.test(node.quotation) || regex.test(node.src)
        );

        if (matches.length === 0 || !ANCHOR.getParams()) {
            resultsContainer.html('<p style="color: #ff6b6b;">No matching quotations found.</p>');
            return;
        }

        // Render matching items and their first-order relations
        matches.forEach(node => {
            var div = document.createElement("div");
            $(div).addClass("quotation_div").css({
                'margin-bottom': '15px',
                'padding': '10px',
                'border-bottom': '1px solid rgba(255,255,255,0.1)'
            });

            var p = document.createElement("p");
            $(p).addClass("quotation").html(node.quotation).css('cursor', 'pointer');
            
            var src = document.createElement("p");
            $(src).addClass("src").text(" -- " + node.src).css('cursor', 'pointer');

            $(div).append(p);
            $(div).append("<br>");
            $(div).append(src);

            // --- FIRST-ORDER RELATIONS EXTRACTION ---
            if (graph.edges || graph.links) {
                const edgesCollection = graph.edges || graph.links;
                // Match edges where source or target matches node.id (or node object itself depending on your graph setup)
                const nodeId = node.id !== undefined ? node.id : node;
                
                const relatedEdges = edgesCollection.filter(edge => {
                    const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
                    const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
                    return sourceId === nodeId || targetId === nodeId;
                });

                if (relatedEdges.length > 0) {
                    var relationsContainer = document.createElement("div");
                    $(relationsContainer).addClass("relations_container").css({
                        'margin-top': '8px',
                        'padding-left': '15px',
                        'font-size': '0.9em',
                        'border-left': '2px solid rgba(255,255,255,0.2)',
                        'color': '#aaa'
                    });

                    var relTitle = document.createElement("p");
                    $(relTitle).text("First-order relations:").css({'margin': '0 0 4px 0', 'font-weight': 'bold'});
                    $(relationsContainer).append(relTitle);

                    relatedEdges.forEach(edge => {
                        // Find the connected node ID/object
                        const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
                        const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
                        
                        const connectedId = (sourceId === nodeId) ? targetId : sourceId;
                        const connectedNode = graph.nodes.find(n => (n.id !== undefined ? n.id : n) === connectedId);

                        var relItem = document.createElement("p");
                        $(relItem).css('margin', '2px 0');
                        
                        const relationText = edge.type || edge.relation || "connected to";
                        const targetText = connectedNode ? (connectedNode.quotation || connectedNode.src || JSON.stringify(connectedNode)) : connectedId;
                        
                        $(relItem).text(`• [${relationText}] -> ${targetText}`);
                        $(relationsContainer).append(relItem);
                    });

                    $(div).append(relationsContainer);
                }
            }
            // ----------------------------------------

            resultsContainer.append(div);
        });

    } catch (e) {
        resultsContainer.html('<p style="color: #ff6b6b;">Invalid regular expression syntax...</p>');
    }
}

// Listen for input changes in real-time
$(document).on('input', '#quotationSearchInput', function() {
        const query = $(this).val().trim();
        console.log('called' , query)
        if (query) {
            // Route to the search page view when there is input
            ANCHOR.route("#search?q=" + encodeURIComponent(query));
        } else {
            // Clear or go back home if input is empty
            $('.search').empty();
            ANCHOR.route("#home")

            console.log('routed home')
        }
});

export default unfold;