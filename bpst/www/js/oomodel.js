var BPST = BPST || {};
(function(){
	function Model() {

        // Setter for instance variable role.
		this.setRole = function(role) {
			this.role = role;
		};

        // Getter for instance variable role.
		this.getRole = function () {
			return this.role;
		};

        // Setter for controller function to operate on
        // network messages sent by the Model.
		this.setMessageListener = function(func) {
			this.messageListener = func;
		};

        // Given JSON data and a handler function,
        // executes controller function to send
        // network messages and process responses.
		this.setMessage = function(data,func) {
			if ( this.messageListener ) {
				data.role = this.getRole();
				this.messageListener(data,func);
			}
		};

        // Setter for controller function that operates
        // on messages sent by the Model to the controls
        // button(s).
		this.setControlsListener = function(func) {
			this.controlsListener = func;
		};

        // Setter for message from Model to controls
        // button(s). The provided message is handled
        // by a function provided by the controller.
		this.setControls = function(string) {
			if ( this.controlsListener ) {
				this.controlsListener(string);
			}
		};

        // Setter for the controller function that operates
        // on messages from the Model to the UI element
        // that displays the currently happening action.
		this.setActionListener = function(func) {
			this.actionListener = func;
		};

        // Setter for the message from the Model to the UI
        // element that displays the currently happening action.
		this.setAction = function(string) {
			if ( this.actionListener ) {
				this.actionListener(string);
			}
		};

        // Setter for the controller function that operates
        // on messages from the Model to the UI element
        // that displays the current status.
		this.setStatusListener = function(func) {
			this.statusListener = func;
		};

        // Setter for the message from the Model to the UI
        // element that displays the current status.
		this.setStatus = function(string) {
			if ( this.statusListener ) {
				this.statusListener(string);
			}
		};
	}
	BPST.Model = Model;
})();