import MVC from '../../lib/MAINFRAME.js';
import TEMPLAR from '../../lib/TEMPLAR.js';

$(document).ready(function(){
	TEMPLAR.initialize({
		pages : ["home", "graph-search", "quotations"],
		defaultPage : "home",
		dir : "partials",
		fade : true,
		fadeTime : 4444,
		helm : 
			[
				{ 
					page : "home",
					fn : function(){
						$(".page_heading").text("Home")
						MVC.View.homeV.initialize();//wat
						MVC.Controller.flash.initialize(TEMPLAR.paramREC()?.index);
					}
				},
				{
					page : "graph-search",
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

$(document).on("TEMPLAR", function(){
	$(".TEMPLAR").scrollTop(0);
})

$(document).ready(function(){
	$(".js_mobile_menu").html($(".sidebar").html())
	$(document).on("click", "a.nav_a", function(e){
		e.preventDefault();

		$(this).prev().toggle();
		$(this).prev().prev().toggle();
		$(this).next().slideToggle();
	});
})