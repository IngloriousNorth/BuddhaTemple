function initializeQuotationsPage(){
	//page heading
	
	refreshNodes();
	$("#quotations_container").empty();
	//quotations
	nodeIndexes = []
	graph.rels.forEach(function(rel){
		//descartes
		console.log(rel.start, rel.end)

		if(ANCHOR.page() === "quotations" && ANCHOR.getParams() && rel.pages.indexOf(ANCHOR.getParams().path) > -1){
			var start = rel.start;
			var end = rel.end;
			var node_start = graph.nodes.find(node => node.index === start);
			var node_end = graph.nodes.find(node => node.index === end);
			if(notQuoted(node_start.index)){				
				pushIndex(node_start.index)
				implementQuotation(node_start)

			}
			if(notQuoted(node_end.index)){
				
				pushIndex(node_end.index);
				implementQuotation(node_end)
			}

		}
	})
	$("div.quotations").scrollTop();
}

function implementQuotation(node){
	var div = document.createElement("div");
	$(div).addClass("quotation_div")
	

	var p = document.createElement("p");
	$(p).addClass("quotation")
	$(p).html(node.quotation)
	var src = document.createElement("p");
	$(src).addClass("src");
	$(src).text(" -- " + node.src + (node.ai ? "Gemini" : ""));
	$(div).append(p);
	$(div).append("<br>")
	$(div).append(src);
	$("#quotations_container").append(div);
	
}


