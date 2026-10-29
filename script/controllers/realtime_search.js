$(document).ready(function() {
    // Listen for input changes in real-time
    $(document).on('input', '#quotationSearchInput', function() {
        const query = $(this).val().trim();

        if (query) {
            // Route to the search page view when there is input
            ANCHOR.route("#search?q=" + encodeURIComponent(query));
        } else {
            // Clear or go back home if input is empty
            window.history.back();
            $('#search_results_container').empty();
        }
    });
});

function initializeSearchPage() {
    const params = ANCHOR.getParams();
    const query = params && params.q ? decodeURIComponent(params.q) : "";
    
    const resultsContainer = $('#search_results_container');
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

        if (matches.length === 0) {
            resultsContainer.html('<p style="color: #ff6b6b;">No matching quotations found.</p>');
            return;
        }

        // Render matching items using your standard quotation structure
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
            resultsContainer.append(div);
        });

    } catch (e) {
        resultsContainer.html('<p style="color: #ff6b6b;">Invalid regular expression syntax...</p>');
    }
}