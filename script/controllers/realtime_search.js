import MVC from '../../lib/MAINFRAME.js';
import TEMPEST from '../../lib/TEMPEST.js';

const unfold = function() {
    const params = TEMPEST.paramREC();
    const query = params && params.q ? decodeURIComponent(params.q) : "";
    const resultsContainer = $('.search');
    resultsContainer.empty();

    if (!query) {
        resultsContainer.html('<p style="color: gray;">Type something to search quotations...</p>');
        return;
    }

    const currentGraph = MVC && MVC.Model && MVC.Model.quotationGraph ? MVC.Model.quotationGraph.graph : null;
    if (!currentGraph || !currentGraph.nodes) {
        return;
    }

    try {
        const regex = new RegExp(query, 'i');
        const matches = currentGraph.nodes.filter(node => 
            regex.test(node.quotation) || regex.test(node.src)
        );

        if (matches.length === 0) {
            resultsContainer.html('<p style="color: #ff6b6b;">No matching quotations found.</p>');
            return;
        }

        matches.forEach(node => {
            // Main quotation container
            var div = document.createElement("div");
            $(div).addClass("quotation_div");

            var p = document.createElement("p");
            $(p).addClass("quotation").html(node.quotation);
            
            var src = document.createElement("p");
            $(src).addClass("src").text(" -- " + node.src + (node.ai ? "Gemini" : ""));

            $(div).append(p).append("<br>").append(src);

            // First-order relations extraction formatted EXACTLY like implementQuotation
            if (currentGraph.rels && Array.isArray(currentGraph.rels)) {
                const relatedRels = currentGraph.rels.filter(rel => 
                    rel.start === node.index || rel.end === node.index
                );

                if (relatedRels.length > 0) {
                    var relationsContainer = document.createElement("div");
                    $(relationsContainer).addClass("relations_container").css({
                        'margin-top': '12px',
                        'padding-left': '15px',
                        'border-left': '2px solid rgba(255,255,255,0.2)'
                    });

                    var relTitle = document.createElement("p");
                    $(relTitle).text("First-order relations (" + relatedRels.length + "):").css({'font-weight': 'bold', 'margin-bottom': '6px'});
                    $(relationsContainer).append(relTitle);

                    relatedRels.forEach(rel => {
                        const neighborIndex = (rel.start === node.index) ? rel.end : rel.start;
                        const neighborNode = currentGraph.nodes.find(n => n.index === neighborIndex);

                        if (neighborNode) {
                            // Sub-quotation div matching .quotation_div layout structure
                            var relDiv = document.createElement("div");
                            $(relDiv).addClass("quotation_div").css({'margin': '8px 0', 'padding-left': '5px'});

                            var relP = document.createElement("p");
                            $(relP).addClass("quotation").html(`[${rel.type || "connected"}] ${neighborNode.quotation}`);
                            
                            var relSrc = document.createElement("p");
                            $(relSrc).addClass("src").text(" -- " + neighborNode.src + (neighborNode.ai ? "Gemini" : ""));

                            $(relDiv).append(relP).append("<br>").append(relSrc);
                            $(relationsContainer).append(relDiv);
                        }
                    });

                    $(div).append(relationsContainer);
                }
            }

            resultsContainer.append(div);
        });

    } catch (e) {
        resultsContainer.html('<p style="color: #ff6b6b;">Invalid regular expression syntax...</p>');
    }
};

// Real-time input binding with clean hiding/clearing
$(document).on('input', '#quotationSearchInput', function() {
    const query = $(this).val().trim();
    if (query) {
        $('.search').show();
        TEMPEST.route("#search?q=" + encodeURIComponent(query));
    } else {
        $('.search').empty().hide();
        TEMPEST.route("#home");
    }
});

export default { unfold };