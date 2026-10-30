import MVC from '../../lib/MAINFRAME';

const unfold = function(){
    const params = TEMPLAR.paramREC();
    const query = params && params.q ? decodeURIComponent(params.q) : "";
    const resultsContainer = $('.search');
    resultsContainer.empty();

    if (!query) {
        resultsContainer.html('<p style="color: gray;">Type something to search quotations...</p>');
        return;
    }

    // Access graph from MVC model or global scope safely
    const currentGraph = (typeof graph !== 'undefined') ? graph : (MVC && MVC.Model && MVC.Model.quotationGraph ? MVC.Model.quotationGraph.graph : null);

    if (!currentGraph || !currentGraph.nodes) {
        return;
    }

    try {
        // Build case-insensitive regular expression from input query
        const regex = new RegExp(query, 'i');

        // Filter nodes matching regex on quotation or src
        const matches = currentGraph.nodes.filter(node => 
            regex.test(node.quotation) || regex.test(node.src)
        );

        if (matches.length === 0 || !TEMPLAR.paramREC()) {
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
            if (currentGraph.rels && Array.isArray(currentGraph.rels)) {
                const relatedRels = currentGraph.rels.filter(rel => 
                    rel.start === node.index || rel.end === node.index
                );

                if (relatedRels.length > 0) {
                    var relationsContainer = document.createElement("div");
                    $(relationsContainer).addClass("relations_container").css({
                        'margin-top': '8px',
                        'padding-left': '15px',
                        'font-size': '0.9em',
                        'border-left': '2px solid rgba(255,255,255,0.2)',
                        'color': '#aaa'
                    });

                    var relTitle = document.createElement("p");
                    $(relTitle).text("First-order relations (" + relatedRels.length + "):").css({'margin': '0 0 4px 0', 'font-weight': 'bold'});
                    $(relationsContainer).append(relTitle);

                    relatedRels.forEach(rel => {
                        const neighborIndex = (rel.start === node.index) ? rel.end : rel.start;
                        const neighborNode = currentGraph.nodes.find(n => n.index === neighborIndex);

                        var relItem = document.createElement("p");
                        $(relItem).css('margin', '2px 0');
                        
                        const relationText = rel.type || "connected to";
                        const targetText = neighborNode ? `"${neighborNode.quotation}" <span class="src">-- ${neighborNode.src}</span>` : `Node #${neighborIndex}`;
                        
                        $(relItem).html(`• [${relationText}] ↳ ${targetText}`);
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
    if (query) {
        TEMPLAR.route("#search?q=" + encodeURIComponent(query));
    } else {
        $('.search').empty();
        TEMPLAR.route("#home");
    }
});

export default { unfold };