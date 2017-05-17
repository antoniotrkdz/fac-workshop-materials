/* global document, EndPoint */
const VideoEndPoint = (function() {
  /** @class VideoEndPoint
   *  @description Specialisation of the generic EndPoint. Each instance of this class
   *  represents an actual video UI end point.
   */

  class VideoEndPoint extends EndPoint {
    constructor(ep_name, remoteVideoTag, localVideoTag, stateTag) {
      // Create a poller for this client
      super(ep_name);
      this._state = 'IDLE';
      this._localVideoTag = localVideoTag;
      this._remoteVideoTag = remoteVideoTag;
      this._stateTag = stateTag;
      stateTag.textContent = this._state;

    }
    /** @method receive
     *  @description Entry point called by the base class when it receives a message for this object from another EndPoint.
     *  @param {String} from - the directory name of the remote EndPoint that sent this request
     *  @param {String} operation - the text string identifying the name of the method to invoke
     *  @param {Object} [data] - the opaque parameter set passed from the remote EndPoint to be sent to the method handler
     */
    // Provide the required 'receive' method
    receive(from, operation, data) {
      this.log("END POINT RX PROCESSING... ("+from+", "+operation+")", data);
      switch (operation) {
      case 'CALL_REQUEST':
        this.callRequest(from);
        break;
      case 'DENIED':
        this.deniedCall();
        break;
      case 'ACCEPT_CALL':
        this.acceptCall(from);
        break;
      case 'SDP_OFFER':
        break;
      case 'SDP_ANSWER':
        break;
      case 'ICE_CANDIDATE':
        break;
      case 'END_CALL':
        this.endCall();
        break;
      case 'hello':
        this.send('V1','hiii','');
        break;
      }
    }
    /** @method hangupCall
     *  @description The localEndPoint (THIS) wants to terminate the call. This is generally the result of the user
     *  clicking the hang-up button. We call our local 'endCall' method and then send 'END_CALL' to the remote party.
     */
    hangupCall() {
      if(/^CALLE[RD]$/.test(this._state)) {
        console.log(this.speakingWith);
        this.send(this.speakingWith, 'END_CALL', {});
        delete this.speakingWith;
        this._state = 'IDLE';
        this._stateTag.textContent = this._state;
      }
      else {
        alert('Which call are you trying to end, mate?');
      }
    }

    endCall() {
      if(/^CALLE[RD]$/.test(this._state)) {

        delete this.speakingWith;
        this._state = 'IDLE';
        this._stateTag.textContent = this._state;
        this.endVideo();
      }
      else {
        alert('Which call are you trying to end, mate?');
      }
    }
    /** @method startCall
     *  @description The user wants to make a call to a remote EndPoint (target). This first part of the process
     *  is to send a message to the target to request the call. The remote EndPoint may accept the call by sending
     *  'ACCEPT_CALL' or decline the call by sending 'DENIED'. Nothing happens at our end other than to send the
     *  message requesting the call. The actuall call is set up if the remote station accepts and sends 'ACCEPT_CALL'.
     *
     *  If the local EndPoint (this) is already in a call (_state is NOT IDLE) then we refuse to start another call.
     *  @param {String} target - the name of the remote party that we want to start a call with
     */
    startCall(target) {
      if (this._state === 'IDLE') {
        this._state = 'RINGING';
        this._stateTag.textContent = this._state;

        this.send(target, 'CALL_REQUEST', {randomkey: 'randomvalue'});
        console.log(this._name, ' call request to ', target);
      } else {
        alert('You\'re in a call, pay attention :)');
      }
    }

    deniedCall() {
      if (this._state === 'RINGING') {
        this._state = 'IDLE';
        this._stateTag.textContent = this._state;
        console.log('Call from ', this._name, 'has been denied');
      }
    }

    callRequest(from) {
      if (this._state === 'IDLE') {
        this._state = 'CALLED';
        this._stateTag.textContent = this._state;
        this.speakingWith = from;
        this.send(from, 'ACCEPT_CALL', '');

      } else {
        this.send(from, 'DENIED', {key: 'Sorry, busy, mate!'});
        alert('Line busy');
      }
    }

    acceptCall(from) {
      if (this._state === 'RINGING') {
        this._state = 'CALLER';
        this._stateTag.textContent = this._state;
        this.speakingWith = from;
        this.startVideo();
      }
    }

    startVideo() {
      var self = this;
      var constraints = {audio: false, video: true};

      navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        var video = self._localVideoTag;
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) { console.log(err.name + ": " + err.message); });
    }

    endVideo() {
      this._localVideoTag.pause();
    }
  }
  return VideoEndPoint;
})();
