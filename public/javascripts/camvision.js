(function ($){
  $('#cam-top-layer').click(function(event){
    let screenWidth = $(document).width();
    let screenHeight = $(document).height();
    let perX = Math.round((event.pageX / screenWidth) * 100);
    let perY = Math.round((event.pageY / screenHeight) * 100);
    console.log(" X: " + perX + " Y: " + perY);
    $.post('api/run/vision/',{perX:perX, perY:perY}, function(data){
       console.log(data);
      }, "json")

  });
  $(document).keydown(function(){
    if (event.code == "ArrowUp") {
      console.log("Up");
      var up = "Up";
      $.post('api/run/vision2/',{up:up}, function(data){
        console.log(data);
      }, "json")
    }
    else if (event.code == "ArrowDown") {
      console.log("Down");
      var down = "Down";
      $.post('api/run/vision2/',{down:down}, function(data){
        console.log(data);
    }, "json")
    }
    else if (event.code == "ArrowRight"){
      console.log("Right");
      var right = "Right";
      $.post('api/run/vision2/',{right:right}, function(data){
        console.log(data);
      }, "json")
    }
    else if (event.code == "ArrowLeft"){
      console.log("Left");
      var left = "Left";
      $.post('api/run/vision2/',{left:left}, function(data){
        console.log(data);
      }, "json")
    }
  });
})(jQuery);
