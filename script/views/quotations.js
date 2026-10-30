module.exports = {
	unfold : function(){
		//page heading
		
		refreshNodes();
		$("#quotations_container").empty();
		
		// Collect matching nodes first so we can sort them
		let matchedNodes = [];

		graph.rels.forEach(function(rel){
			if(ANCHOR.page() === "quotations" && ANCHOR.getParams() && rel.pages.indexOf(ANCHOR.getParams().path) > -1){
				var start = rel.start;
				var end = rel.end;
				var node_start = graph.nodes.find(node => node.index === start);
				var node_end = graph.nodes.find(node => node.index === end);
				
				if(node_start && notQuoted(node_start.index)){				
					pushIndex(node_start.index);
					matchedNodes.push(node_start);
				}
				if(node_end && notQuoted(node_end.index)){
					pushIndex(node_end.index);
					matchedNodes.push(node_end);
				}
			}
		});

		// --- HELPER FUNCTION TO COUNT EDGES ---
		function getNodeEdgeCount(nodeIndex) {
			let count = 0;
			graph.rels.forEach(function(rel) {
				if (rel.start === nodeIndex || rel.end === nodeIndex) {
					count++;
				}
			});
			return count;
		}

		// --- QUANTUM SORT + NUMBER OF EDGES SORTING LOGIC ---
		matchedNodes.sort(function(a, b) {
			// 1. Quantum sort factor (from your Val Town proxy QRNG property, e.g., a.qrng)
			let qrngA = a.qrng !== undefined ? a.qrng : 0;
			let qrngB = b.qrng !== undefined ? b.qrng : 0;

			// 2. Number of edges factor
			let edgesA = getNodeEdgeCount(a.index);
			let edgesB = getNodeEdgeCount(b.index);

			// Combined Sorting: Primary sort by QRNG value, secondary tie-breaker by edge count (descending)
			if (qrngA !== qrngB) {
				return qrngA - qrngB; // Ascending QRNG order
			} else {
				return edgesB - edgesA; // Descending edge count order if QRNG values match
			}
		});

		// Render the sorted nodes
		matchedNodes.forEach(function(node){
			implementQuotation(node);
		});

		$("div.quotations").scrollTop();
	}
}

function implementQuotation(node){
	var div = document.createElement("div");
	$(div).addClass("quotation_div");
	
	var p = document.createElement("p");
	$(p).addClass("quotation");
	$(p).html(node.quotation);
	
	var src = document.createElement("p");
	$(src).addClass("src");
	$(src).text(" -- " + node.src + (node.ai ? "Gemini" : ""));
	
	$(div).append(p);
	$(div).append("<br>");
	$(div).append(src);
	$("#quotations_container").append(div);
}

function pushIndex(index){
	nodeIndexes.push(index);
}

function pushNode(node){
	nodes.push(node);
}

function refreshNodes(){
	nodeIndexes = [];
	nodes = [];
}

function notQuoted(index){
	if(nodeIndexes.indexOf(index) === -1){
		return true;
	}
	else{
		return false;
	}
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


