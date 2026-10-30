import MVC from '../../lib/MAINFRAME.js';
import TEMPLAR from '../../lib/TEMPLAR.js';

const unfold = function() {
    const params = TEMPLAR.paramREC();
    const query = params && params.q ? decodeURIComponent(params.q).trim() : "";
    const resultsContainer = $('.graph-search');
    resultsContainer.empty();

    const currentGraph = MVC && MVC.Model && MVC.Model.quotationGraph ? MVC.Model.quotationGraph.graph : null;
    if (!currentGraph || !currentGraph.nodes) {
        return;
    }

    try {
        // Filter nodes matching query regex or fallback to substring search
        const matches = query ? currentGraph.nodes.filter(node => {
            try {
                const regex = new RegExp(query, 'i');
                return regex.test(node.quotation) || regex.test(node.src);
            } catch (err) {
                return (node.quotation && node.quotation.toLowerCase().includes(query.toLowerCase())) ||
                       (node.src && node.src.toLowerCase().includes(query.toLowerCase()));
            }
        }) : currentGraph.nodes;

        if (matches.length === 0) {
            resultsContainer.html('<p style="color: #ff6b6b;">No matching quotations found.</p>');
            return;
        }

        // Helper function to safely highlight search terms in blue without breaking HTML tags
        const highlightQuery = (text, q) => {
            if (!q || !text) return text;
            try {
                const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Negative lookahead ensures we don't match inside HTML tags like <br>
                const regex = new RegExp(`(${escapedQuery})(?![^<>]*>)`, 'gi');
                return text.replace(regex, '<span style="color: gold; font-weight: bold; background-color: rgba(255, 212, 59, 0.15); padding: 0 2px; border-radius: 3px;">$1</span>');
            } catch (e) {
                return text;
            }
        };

        matches.forEach(node => {
            var div = document.createElement("div");
            $(div).addClass("quotation_div");

            var p = document.createElement("p");
            $(p).addClass("quotation").html(highlightQuery(node.quotation, query));
            
            var src = document.createElement("p");
            const rawSrcText = " -- " + node.src + (node.ai ? " Gemini" : "");
            $(src).addClass("src").html(highlightQuery(rawSrcText, query));

            $(div).append(p).append("<br>").append(src);
            resultsContainer.append(div);
        });

    } catch (e) {
        resultsContainer.html('<p style="color: #ff6b6b;">Invalid regular expression syntax...</p>');
    }
};

// Real-time input binding with clean hiding/routing
$(document).on('input', '#quotationSearchInput', function() {
    const query = $(this).val().trim();
    if (query) {
        $('.graph-search').show();
        TEMPLAR.route("#graph-search?q=" + encodeURIComponent(query));
    } else {
        $('.graph-search').empty().hide();
        TEMPLAR.route("#home");
    }
});

export default { unfold };