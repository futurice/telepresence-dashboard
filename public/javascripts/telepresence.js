(function ($) {
	$('.tp-button-action').on("click", function(event){
		let buttonClicked = $(this).data("buttonInfo");
		let currentScenarioKey = telepresence.currentScenarioKey;
		console.log(buttonClicked);
		$.post('/api/run/preset/'+currentScenarioKey+'/'+buttonClicked,
		function (data) {
			console.log(data);
		}).fail(function(error){ console.log(error); });
	});

	//read text input from the speech box
	$('#tp-speech-btn').click( function(){
		let tp_speech = $('#tp-speech-input').val();
		console.log(tp_speech);
		$.post('/api/run/speech', {speech:tp_speech},function(data){console.log(data);})
		.fail(function(error){console.log(error)});
	});
	//reas text input from the code box
	$('#tp-code-btn').click(function(){
		let tp_code = $('#tp-code-input').val();
		console.log(tp_code);
		$.post('api/run/code', {code:tp_code},function(data){console.log(data);})
		.fail(function(error){console.log(error)});
	});

	$(document).ready(function(){
		$('textarea').each(function(i, block){
			hljs.highlightBlock(block);
		});
	});

	function showSuccess(message) {
		// $().fadeIn
		// setTimeout
		// $().fadeOut
	}

	function showError(message) {
		// $().fadeIn
		// setTimeout
		// $().fadeOut
	}

})(jQuery);
