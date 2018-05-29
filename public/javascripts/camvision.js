(function ($){
  $('#cam-top-layer').click(function(event){
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
    let perX = Math.round((event.pageX / screenWidth) * 100);
    let perY = Math.round((event.pageY / screenHeight) * 100);
    console.log(" X: " + perX + " Y: " + perY);
    $.post('api/run/vision/',{perX:perX, perY:perY}, function(data){
      console.log(data);
    }, "json")
		.fail(function(error){console.log(error)});
  });
})(jQuery);
