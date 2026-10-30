$(document).ready(function(){
	$("#menu").click(function(){
		$(".menu").slideToggle();
	})

	$(window).resize(function(){
		if($(window).width() > 1079)
			$(".menu").hide();
	})
})