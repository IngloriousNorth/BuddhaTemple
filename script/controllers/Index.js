import MVC from '../../lib/MAINFRAME.js';
import TEMPEST from '../../lib/TEMPEST.js';

$(document).ready(function(){
	TEMPEST.initialize({
		default : "flash",
		helm : 
			[
				{ 
					page : "flash",
					fn : function(){
						MVC.View.home.initialize();
						MVC.Controller.flashCard.initialize(TEMPEST.paramREC()?.index);
					}
				},
				{
					page : "search",
					fn : function(){
						MVC.Controller.realTimeSearch.unfold(TEMPEST.paramREC().q);
					}
				},
				{
					page: "quotations",
					fn : function(){
						MVC.Controller.quotations.unfold();
					}
				}

			]
	}, ()=>MVC.View.menuV.unfold());
})

$(document).on("TEMPEST", function(){


	$(".mobile_menu").hide();
	
	if(TEMPEST.pageREC() === "flash"){
		$(".page_heading").text("Flash Card")
	}
	else{
		$(".page_heading").text(TEMPEST.paramREC().path)
	}
		
})