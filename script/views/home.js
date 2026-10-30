import MVC from '../../lib/MAINFRAME.js';

const initialize = function(){
	$(".flash #myriad").html(MVC.Model.home.white_lotus.myriad);
	$(".flash #myriad_src").text("-- The Lotus Sutra")
}

export default { initialize };