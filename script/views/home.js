import MVC from '../../lib/MAINFRAME.js';

const initialize = function(){
	$(".flash #myriad").html(MVC.Model.home.white_lotus.myriad);
	$(".flash #myriad_src").text("-- The Lotus Sutra")
	$(".flash #home_description").html(MVC.Model.home.white_lotus.flash_description)
	$(".flash #navigation_instructions").text(MVC.Model.home.white_lotus.navigation_instructions)
	$(".flash #engineering").text(white_lotus.engineering)
}

export default { initialize };