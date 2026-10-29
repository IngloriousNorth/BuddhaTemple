var	firstLoad = true;

$(document).ready(function(){
	ANCHOR.route(ANCHOR.page() ? ("#" + ANCHOR.page() + (ANCHOR.page() === "quotations" ? "?path=" + ANCHOR.getParams().path : "")) : "#home")
	initializePages();
})

$(document).on("ANCHOR", function(){


	$(".mobile_menu").hide();
	if(!firstLoad){
		initializePages();
	}
	firstLoad = false;
	if(ANCHOR.page() === "home"){
		$(".page_heading").text("Home")
	}
	else{
		$(".page_heading").text(ANCHOR.getParams().path)
	}
		
})

function initializePages(){
	switch(ANCHOR.page()){
		case "home":
			initializeHome();
            break;
		case "quotations" :
			initializeQuotationsPage();
			break;		
        case "search" :
            initializeSearchPage();
            break;
		default :
			break;
	}
}