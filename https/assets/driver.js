/* global document, EndPoint, VideoEndPoint */
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    // Application logic here
    var v1= new VideoEndPoint('V1');
    var v2= new VideoEndPoint('V2');

    v1.send('V2','hello',{a:'hello'});
    console.log(EndPoint);
  });
})();
