import MVC from '../../lib/MAINFRAME.js';

$(document).ready(function(){
	TEMPLAR.initialize({
		defaultPage : "flash",
		helm : 
			[
				{ 
					page : "flash",
					fn : function(){
						MVC.Controllers.flashCard.flashInitialize(TEMPLAR.paramREC().index);
					}
				},
				{
					page : "search",
					fn : function(){
						MVC.Controllers.realTimeSearch.unfold(TEMPLAR.paramREC().q);
					}
				}

			]
	});
})

$(document).on("TEMPLAR", function(){


	$(".mobile_menu").hide();
	
	if(TEMPLAR.pageREC() === "home"){
		$(".page_heading").text("Home")
	}
	else{
		$(".page_heading").text(TEMPLAR.paramREC().path)
	}
		
})