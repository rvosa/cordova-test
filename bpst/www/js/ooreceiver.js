var BPST = BPST || {};
(function(){
	function Receiver() {	
		this.connected = false;
		this.intervalId = 0;

		// listen for server messages from baby
		this.run = function () {
			if ( this.connected ) {
		
				// stop polling thread
				clearInterval(this.intervalId);
				this.connected = false;
		
				// update UI
				this.setControls('start');
				this.setAction('stopped');
				this.setStatus('standing by');	
			}
			else {
				this.connected = true;	
				this.intervalId = setInterval(function(){
					this.setMessage(
						{action:'ping'},
			
						// response handler
						function(data) {
				
							// have seen other actor
							if ( data.role != this.getRole() ) {						
								this.setStatus('alert at '+data.time);
							}	
						}
					)
				},1000);
		
				// update UI
				this.setControls('stop');
				this.setStatus('quiet');
				this.setAction('monitoring');				
			}
		}
	}
	Receiver.prototype = new BPST.Model();
	BPST.Receiver = Receiver;
})();