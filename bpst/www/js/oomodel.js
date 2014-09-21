var BPST = BPST || {};
(function(){
	function Model() {
	
		this.setRole = function(role) {
			this.role = role;
		};
	
		this.getRole = function () {
			return this.role;
		};
	
		this.setMessageListener = function(func) {
			this.messageListener = func;
		};
	
		this.setMessage = function(data,func) {
			if ( this.messageListener ) {
				data.role = this.getRole();
				this.messageListener(data,func);
			}
		};
	
		this.setControlsListener = function(func) {
			this.controlsListener = func;
		};
	
		this.setControls = function(string) {
			if ( this.controlsListener ) {
				this.controlsListener(string);
			}
		};
	
		this.setActionListener = function(func) {
			this.actionListener = func;
		};
	
		this.setAction = function(string) {
			if ( this.actionListener ) {
				this.actionListener(string);
			}
		};

		this.setStatusListener = function(func) {
			this.statusListener = func;
		};
	
		this.setStatus = function(string) {
			if ( this.statusListener ) {
				this.statusListener(string);
			}
		};
	}
	BPST.Model = Model;
})();