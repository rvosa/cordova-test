var BPST = BPST || {};
(function(){
	function Sender() {	

		// fork getUserMedia for multiple browser versions, for those
		// that need prefixes
		navigator.getUserMedia = (navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia 
		);

		// instance variables
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.analyser = this.audioCtx.createAnalyser();
		this.interval = 500; // ms between sampling
		this.threshold = 0.5; // rms volume, 0 .. 1	
		this.mic; // microphone	
		this.connected = false;

		// monitor values to see if they exceed threshold 
		this.monitor = function () {

			// don't process remaining buffer if we're disconnecting
			if ( this.connected ) {
				this.setAction('monitoring');
				this.setStatus('quiet');
	
				// populate dataArray of 8-bit unsigned ints from analyser
				var bufferLength = this.analyser.frequencyBinCount;								
				var dataArray = new Uint8Array(bufferLength);
				this.analyser.getByteTimeDomainData(dataArray);
	
				// evaluate data array
				var alarm = false;
				for ( var i = 0; i < dataArray.length; i++ ) {
	
					// go from values 0..255, where 128=0dB, to -1..1, then make absolute
					var rescaled = ( dataArray[i] - 128 ) / 128; // 0..255 => -1..1
					var normalized = Math.abs( rescaled ); // 1..1
		
					// peak event
					if ( normalized > this.threshold ) {
						this.setStatus('alarm');
				
						// call only once for this dataArray
						if ( ! alarm ) {
							this.setAction('calling');
							this.setMessage({action:'alarm'},function(data){});
						}
						alarm = true;
					}
				}
			}
		};			

		// Success callback
		this.processStream = function (stream) {

			// Create a MediaStreamAudioSourceNode for the analyser
			this.mic = this.audioCtx.createMediaStreamSource(stream);
			this.analyser.fftSize = 256;
			this.mic.connect(this.analyser);
			var self = this;
	
			// monitor values every interval milliseconds
			setInterval(function(){self.monitor()}, this.interval);
		};

		// Error callback
		this.streamError = function (err) {
			console.log('The following getUserMedia error occured: ' + err);
		};				

		// fire getUserMedia, start sampling from microphone
		this.run = function () {
			if ( navigator.getUserMedia ) {
				if ( this.connected ) {
					this.mic.disconnect();
					this.connected = false;
			
					// update UI
					this.setControls('start');
					this.setStatus('stopped');
					this.setAction('standing by');
				}
				else {
					var self = this;
					this.connected = true;
					navigator.getUserMedia( 
						{ audio: true }, 
						function(stream) {
							self.processStream(stream);
						},
						function(err) { 
							self.streamError(err);
						}
					);
			
					// update UI
					this.setControls('stop');
					this.setStatus('starting');
				}
			} 
			else {
				alert('Can\'t access microphone: getUserMedia not supported!');
			}
		};
	}
	Sender.prototype = new BPST.Model();
	BPST.Sender = Sender;
})();