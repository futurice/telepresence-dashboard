(function ($) {
	$('.tp-button-action').on("click", function(event){
		let buttonClicked = $(this).data("buttonInfo");
		console.log(buttonClicked);
		$.post('/api/run/preset/'+buttonClicked, function(data){console.log(data);})
		.fail(function(error){console.log(data)});
	});
	//read text input from the speech box
	$('#tp-speech-btn').click( function(){
		let tp_speech = $('#tp-speech-input').val();
		console.log(tp_speech);
		$.post('/api/run/speech', {speech:tp_speech},function(data){console.log(data);})
		.fail(function(error){console.log(data)});
	});
	//reas text input from the code box
	$('#tp-code-btn').click(function(){
		let tp_code = $('#tp-code-input').val();
		console.log(tp_code);
		$.post('api/run/code', {code:tp_code},function(data){console.log(data);})
		.fail(function(error){console.log(data)});
	});

	$('#tp-idle-btn').bootstrapToggle({
		on: "Flow On",
		off: "Flow Off"
	});
	})


})(jQuery)
