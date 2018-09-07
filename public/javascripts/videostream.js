(function ($) {
  var webcam_addr = "localhost";
      var webcam_port = "12000";
      var webcam_host = $("#video-layer");
      var socket = io.connect('http://' + webcam_addr + ':' + webcam_port);

      socket.on('image', function (data) {
          webcam_host.attr("src", "data:image/jpeg;base64," + data );
      });
})(jQuery);
