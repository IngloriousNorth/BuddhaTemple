import MVC from '../../lib/MAINFRAME.js';
import TEMPLAR from '../../lib/TEMPLAR.js';

$(document).ready(function(){
	TEMPLAR.initialize({
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
						MVC.Controller.flash.initialize(TEMPLAR.paramREC()?.index);
					}
				},
				{
					page : "search",
					fn : function(){
						MVC.Controller.search.unfold(TEMPLAR.paramREC().q);
						$("h2").text("Graph-Search");
					}
				},
				{
					page: "quotations",
					fn : function(){
						MVC.Controller.quotations.unfold();
						$(".page_heading").text(TEMPLAR.paramREC().path)
					}
				}

			]
	}, ()=>MVC.View.menuV.unfold());
})