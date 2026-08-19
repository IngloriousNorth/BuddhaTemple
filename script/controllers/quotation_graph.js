function pushIndex(index){
	nodeIndexes.push(index);
}

function pushNode(node){
	nodes.push(node)
}

function refreshNodes(){
	nodeIndexes = [];
	nodes = []
}

function notQuoted(index){
	if(nodeIndexes.indexOf(index) === -1){
		return true;
	}
	else{
		return false;
	}
}

