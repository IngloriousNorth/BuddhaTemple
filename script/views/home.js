import MVC from '../../lib/MAINFRAME.js';

const initialize = function(){
	$(".home #myriad").html(MVC.Model.home.white_lotus.myriad);
	$(".home #myriad_src").text("-- The Lotus Sutra")
}

export default { initialize };