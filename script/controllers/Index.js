import MVC from '../../lib/MAINFRAME.js';
import TEMPEST from '../../lib/TEMPEST.js';

$(document).ready(function(){
	TEMPEST.initialize({
		pages : ["quantum_flash"],
		defaultPage : "quantum_flash",
		dir : "partials",
		fade : true,
		fadeTime : 175,
		helm : 
			[
				{ 
					page : "quantum_flash",
					fn : function(){
						MVC.Controller.flash.initialize(TEMPEST.paramREC()?.index);
					}
				},
				

			]
	});
})

$(document).on("TEMPEST", function(){
	$(".TEMPEST").scrollTop(0);
})

$(document).ready(function(){
	$.get(`../../partials/quantum_flash.html`), (html)=> { 
		console.log(html); $(".quantum_flash").html(html);
	}
})