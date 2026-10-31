import MVC from '../../lib/MAINFRAME.js';

const initialize = function(){
	$(".home #myriad_src").text("-- The Lotus Sutra")
	$(".home #myriad").html(MVC.Model.home.white_lotus.myriad + $("#myriad_src").text());
}

export default { initialize };