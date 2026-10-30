import TEMPLAR from "./TEMPLAR.js"

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

$(document).on("TEMPLAR", function(){
	$(".js_mobile_menu").hide();
})

$(document).ready(function(){
	$("#js_mobile_menu").click(function(e){
		e.preventDefault();
		if(!$(".js_mobile_menu").is(":visible")){
			$(".page_heading").text("Menu");
		}
		else{
			let heading;
			if(TEMPLAR.pageREC()==="quotations"){
				heading = TEMPLAR.paramREC().path;
			}
			else if(!TEMPLAR.pageREC()){
				heading = TEMPLAR._default;
			}
			else{
				heading = TEMPLAR.pageREC();
			}
			$(".page_heading").text(toTitleCase(heading));
		}
		$(".js_mobile_menu").slideToggle();

	})

	$(window).resize(function(){
		if($(window).width() > 1079)
			$(".js_mobile_menu").hide();
	})
})