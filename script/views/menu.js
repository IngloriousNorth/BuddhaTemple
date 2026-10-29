$(document).ready(function(){

	menu.western_thinkers.forEach(function(item){
		addDictionary(item, $(".thinkers_menu"))
	})
	menu.buddhist_sutras.forEach(function(item){
		addDictionary(item, $(".sutras_menu"))
	})
	menu.eastern_glossary.forEach(function(item){
		addDictionary(item, $(".eastern_menu"))
	})

	menu.western_glossary.forEach(function(item){
		addDictionary(item, $(".western_menu"))
	})

	menu.hermetic_glossary.forEach(function(item){
		addDictionary(item, $(".hermetic_menu"))
	})


	function addDictionary(item, menu){
		const li = document.createElement("li");
		const a = document.createElement("a");
		$(a).text(item)
		$(a).addClass("ANCHOR")
		$(a).addClass("quotations")
		$(a).attr("href" , "#quotations?path=" + item)
 		$(li).append(a)
 		menu.append(li)
	}

	$(".nav_a, .mobile_nav_a").click(function(e){
		e.preventDefault();

		$(this).prev().toggle();
		$(this).prev().prev().toggle();
		$(this).next().slideToggle();

	})

	var showing = false;

	/* MOBILE */
	$("#ham").click(function(e){
		e.preventDefault();
		$(this).toggleClass("hamGlows");
		$(".mobile_menu").fadeToggle();
		showing = !showing;
		processMenuHeading();

	})

	function processMenuHeading(){
		if(showing){
			$(".page_heading").text("Menu")
		}
		else if(ANCHOR.page() === "home"){
			$(".page_heading").text("Home")
		}
		else if(ANCHOR.page() === "quotations"){
			console.log("HERE")
			$(".page_heading").text(ANCHOR.getParams().path)
		}
	}

	$(document).on("ANCHOR", function(){
		$('.ANCHOR_partial').animate({
            scrollTop: 0
        }, 'smooth');
	})
	
})
