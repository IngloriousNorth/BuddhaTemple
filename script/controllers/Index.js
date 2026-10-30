import MVC from '../../lib/MAINFRAME.js';
import TEMPEST from '../../lib/TEMPEST.js';

$(document).ready(function(){
	TEMPEST.initialize({
		pages : ["flash", "search", "quotations"],
		defaultPage : "flash",
		dir : "partials",
		helm : 
			[
				{ 
					page : "flash",
					fn : function(){
						$(".page_heading").text("Flash Card")
						MVC.View.homeV.initialize();//wat
						MVC.Controller.flash.initialize(TEMPEST.paramREC()?.index);
					}
				},
				{
					page : "search",
					fn : function(){
						MVC.Controller.search.unfold(TEMPEST.paramREC().q);
						$("h2").text("Graph-Search");
					}
				},
				{
					page: "quotations",
					fn : function(){
						MVC.Controller.quotations.unfold();
						$(".page_heading").text(TEMPEST.paramREC().path)
					}
				}

			]
	}, ()=>MVC.View.menuV.unfold());
})