(function ($){
  $('#cam-top-layer').click(function(event){
    let screenWidth = $(document).width();
    let screenHeight = $(document).height();
    let perX = Math.round((event.pageX / screenWidth) * 100);
    let perY = Math.round((event.pageY / screenHeight) * 100);
    console.log(" X: " + perX + " Y: " + perY);
    $.post('api/run/vision/',{perX:perX, perY:perY}, function(data){
       console.log(data);
     }, "json");
  });


	$('button.vision-button-action').on("click", function(event){
    event.preventDefault();
		let visionButton = $(this).data("buttonInfo");
		console.log(visionButton);
    $('.vision-button-action').prop("disabled", "disabled");
    var enable = function(){
      $('.vision-button-action').removeAttr("disabled");
    };
    setTimeout(enable, 5000);
		$.post('/api/run/preset/'+visionButton,
		function (data) {
			console.log(data);
		}).fail(function(error){ console.log(error); });
	});

  $(document).keydown(function(){
    if (event.code == "ArrowUp") {
      $('.vision-button-action').prop("disabled", false);
      console.log("Up");
      var up = "Up";
      $.post('api/run/vision/',{up:up}, function(data){
        console.log(data);
      }, "json")
    }
    else if (event.code == "ArrowDown") {
      console.log("Down");
      var down = "Down";
      $.post('api/run/vision/',{down:down}, function(data){
        console.log(data);
    }, "json")
    }
    else if (event.code == "ArrowRight"){
      console.log("Right");
      var right = "Right";
      $.post('api/run/vision/',{right:right}, function(data){
        console.log(data);
      }, "json")
    }
    else if (event.code == "ArrowLeft"){
      console.log("Left");
      var left = "Left";
      $.post('api/run/vision/',{left:left}, function(data){
        console.log(data);
      }, "json")
    }
  });
})(jQuery);
