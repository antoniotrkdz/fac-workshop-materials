/* global document, EndPoint, VideoEndPoint */
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    // Application logic here

    function getTags(ep_name) {
      return {
        remoteVideo: document.querySelector('#' + ep_name + ' .remoteVideo'),
        localVideo: document.querySelector('#' + ep_name + ' .localVideo'),
        state: document.querySelector('#' + ep_name + ' .state'),
      };
    }

    // var endpoint = {};
    var V1 = new VideoEndPoint('V1', getTags('V1').remoteVideo, getTags('V1').localVideo, getTags('V1').state);
    var V2 = new VideoEndPoint('V2', getTags('V2').remoteVideo, getTags('V2').localVideo, getTags('V2').state);
    var V3 = new VideoEndPoint('V3', getTags('V3').remoteVideo, getTags('V3').localVideo, getTags('V3').state);
    var V4 = new VideoEndPoint('V4', getTags('V4').remoteVideo, getTags('V4').localVideo, getTags('V4').state);

    var endpoint = { V1, V2, V3, V4 };

    document.querySelectorAll('.startCall').forEach((el, index) => {
      el.addEventListener('click', () => {
        var ep_name = el.parentNode.id;
        var target_name = el.parentNode.querySelector('input').value;

        endpoint[ep_name].startCall(target_name);
      });

      // v1.send('V2','hello',{a: 'hello'});
    });

    document.querySelectorAll('.endCall').forEach((el, index) => {
      el.addEventListener('click', () => {
        var ep_name = el.parentNode.id;
        var target_name = el.parentNode.querySelector('input').value;

        endpoint[ep_name].hangupCall();
      });

      // v1.send('V2','hello',{a: 'hello'});
    });
    console.log(EndPoint);
  });
})();
