import MVC from '../../lib/MAINFRAME.js';
import TEMPLAR from '../../lib/TEMPLAR.js';

const unfold = function(){
	const menuData = MVC.Model.menu.menu;

	if (menuData.western_thinkers) {
		menuData.western_thinkers.forEach(function(item){
			addDictionary(item, $(".thinkers_menu"));
		});
	}
	if (menuData.buddhist_sutras) {
		menuData.buddhist_sutras.forEach(function(item){
			addDictionary(item, $(".sutras_menu"));
		});
	}
	if (menuData.eastern_glossary) {
		menuData.eastern_glossary.forEach(function(item){
			addDictionary(item, $(".eastern_menu"));
		});
	}
	if (menuData.western_glossary) {
		menuData.western_glossary.forEach(function(item){
			addDictionary(item, $(".western_menu"));
		});
	}
	if (menuData.hermetic_glossary) {
		menuData.hermetic_glossary.forEach(function(item){
			addDictionary(item, $(".hermetic_menu"));
		});
	}

	function addDictionary(item, menu){
		const li = document.createElement("li");
		const a = document.createElement("a");
		$(a).text(item);
		$(a).addClass("TEMPLAR");
		$(a).addClass("quotations");
		
		const menuClass = $(menu).attr("class");
		if (menuClass) {
			const classParts = menuClass.split(" ");
			if (classParts[2]) {
				$(a).addClass(classParts[2]);
			}
		}

		$(a).attr("href", "#quotations?path=" + item);
		$(li).append(a);
		menu.append(li);
	}

	$(".nav_a, .mobile_nav_a").click(function(e){
		e.preventDefault();
		$(this).prev().toggle();
		$(this).prev().prev().toggle();
		$(this).next().slideToggle();
	});

	//for mobile
	function processMenuHeading(){
		if(showing){
			$(".page_heading").text("Menu");
		}
		else if(TEMPLAR.pageREC() === "flash"){
			$(".page_heading").text("Home");
		}
		else if(TEMPLAR.pageREC() === "quotations"){
			const params = TEMPLAR.paramREC();
			if (params && params.path) {
				$(".page_heading").text(params.path);
			}
		}
	}

	$(document).on("TEMPLAR", function(){
		$('.TEMPLAR').animate({
            scrollTop: 0
        }, 'smooth');
	});
};

export default { unfold };