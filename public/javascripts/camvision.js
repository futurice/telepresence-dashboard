(function ($){
  $('#cam-top-layer').click(function(event){
    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;
    var perX = Math.round((event.pageX / screenWidth) * 100);
    var perY = Math.round((event.pageY / screenHeight) * 100);
    console.log(" X: " + perX + " Y: " + perY);
    $.post('api/run/vision',function(data){console.log(data);})
		.fail(function(error){console.log(error)});

    //here insert functions to read the x and y coordinates
  });
})(jQuery);
