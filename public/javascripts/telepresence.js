(function ($) {
	$('.tp-button-action').on("click", function(event){
		event.preventDefault();
		let buttonClicked = $(this).data("buttonInfo");
		let currentScenarioKey = telepresence.currentScenarioKey;
		$('.tp-button-action').prop("disabled", "disabled");
		$('#tp-success').css("display", "inline");
		var disable = function(){
			$('#tp-success').css("display", "none");
		};
		setTimeout(disable, 3000);
		var enable = function(){
			$('.tp-button-action').removeAttr("disabled");
		};
		setTimeout(enable, 10000);
		console.log(buttonClicked);
		$.post('/api/run/preset/'+currentScenarioKey+'/'+buttonClicked,
		function (data) {
			console.log(data);
		}).fail(function(error){
			console.log(error);
			$('#tp-fail').css("display", "inline");
	 		var disable = function(){
				$('#tp-fail').css("display", "none");};
			setTimeout(disable, 3000);
			});
	});

	//read text input from the speech box
	$('#tp-speech-btn').click( function(){
		let tp_speech = $('#tp-speech-input').val();
		console.log(tp_speech);
		$.post('/api/run/speech', {speech:tp_speech},function(data){console.log(data);})
		.fail(function(error){console.log(error)});
	});
	//read text input from the code box
	$('#tp-code-btn').click(function(){
		let tp_code = $('#tp-code-input').val();
		console.log(tp_code);
		$.post('api/run/code', {code:tp_code},function(data){console.log(data);})
		.fail(function(error){console.log(error)});
	});

//Highlighter for the text box, work on this later.
	//$(document).ready(function(){
		//$('#tp-text-box').each(function(i, block){
			//hljs.highlightBlock(block);
	//	});
	//});

	//function showSuccess() {
	//$(document).ready(function(){
		//$(".tp-button-action").click(function(){
			//$(".alert-success").fadeIn();
			//setTimeout(function(){
				//$(".alert-success").fadeOut();}, 3000);
		//});
	//});

	//function showError(){
	//$(document).ready(function(){
		//$(".tp-button-action").click(function(){
			//$(".alert-danger").fadeIn();
			//setTimeout(function(){
				//$(".alert-danger").fadeOut();}, 3000);
		//});
	//});

	//showSuccess();
	//setTimeout
	//$().fadeOut
	//});
		// $().fadeOut
	//}
	//function showError(message) {

	//}
		// $().fadeIn
		// setTimeout
		// $().fadeOut

	//showError();

})(jQuery);
