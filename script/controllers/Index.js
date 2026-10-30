import MVC from '../../lib/MAINFRAME.js';

$(document).ready(function(){
	TEMPLAR.initialize({
		defaultPage : "flash",
		helm : 
			[
				{ 
					page : "flash",
					fn : function(){
						MVC.View.home.initialize();
						MVC.Controller.flashCard.initialize(TEMPLAR.paramREC().index);
					}
				},
				{
					page : "search",
					fn : function(){
						MVC.Controller.realTimeSearch.unfold(TEMPLAR.paramREC().q);
					}
				},
				{
					page: "quotations",
					fn : function(){
						MVC.Controller.quotations.unfold();
					}
				}

			]
	}, ()=>MVC.View.menu.unfold());
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