var BPST = BPST || {};
(function(){

	function Controller() {

		var role = 'baby';
		var uuid = Math.uuid(6);
		var session; // is set later
		var baseUrl = 'http://192.168.178.11:8080/';
		this.maxAttempts = 10;
		this.intervalMs = 1000;

        // Triggered after radio button selection is confirmed. Reads
        // selected role, advances UI to challenge/response fields.
		this.setRole = function () {
			role = $("input[type='radio'][name='role']:checked").val();

            // Insert UUID in div that corresponds with focal role,
            // create text input for challenge response.
			$('.sessionPart').each(function(){
				if ( this.id === role ) {
					$(this).text(uuid);
				}
				else {
                    $(this).html('<input type="text" size="6" id="password" />');
				}
			});

            // Change the class of the highest container div
            // to the focal role so CSS can inherit from it.
            $('#background').attr('class',role);

            // Advance the UI
			this.showOnly('session');
            console.log('Selected role: '+role);
		};

        // Returns the private static role variable.
		this.getRole = function () {
			return role;
		};	

        // Inserts provided text in #status element.
		this.logStatus = function(statusText) {
			$('#status').text(statusText);
		};

        // Inserts provided text in #action element.
		this.logAction = function(actionText) {
			$('#action').text(actionText);
		};

        // Inserts provided text in #start element.
		this.toggleButton = function(text) {
			$('#start').text(text);
		};

        // Performs AJAX GET request with data query string,
        // passes returns JSON to provided handler function.
		this.update = function (data,handler) {
			var self = this;
			$.ajax({
				type     : 'GET',
				url      : baseUrl + session,
				success  : handler,
				dataType : 'json',
				data     : data,
				error    : function(xhr,status,err) {
					self.logAction('retrying');
					self.logStatus('error!');
                    console.log('status: '+status);
                    console.log('error: '+err);
				}
			});		
		};

        // Attempts to establish session by handshake iterations.
		this.startSession = function() {
			var self = this;		
			var passInput = $('#password');
			var value = passInput.val();
			passInput.replaceWith(value);
			session = $('#baby').text() + $('#parent').text();
            console.log("Entered password: "+value);
	
			// poll every second, 10 times
			var attempts = 0;
			var intervalId = setInterval(function(){
	
				// do request
				self.update(
					{ 'role' : role, 'action' : 'handshake' },
			
					// response handler
					function(data) {
			
						// track status
						attempts++;
						self.logAction('polling');
						self.logStatus('disconnected');
				
						// have seen other actor
						if ( data.role !== self.role ) {
							self.logAction('standing by');
							self.logStatus('ready');		
							self.showOnly('run');		
							clearInterval(intervalId);
						}
						if ( attempts == self.maxAttempts ) {
							alert('giving up');
							clearInterval(intervalId);
						}		
					}
				)
			},this.intervalMs);
		};

        // Only shows the provided #id element, hides others in the
        // .showOnly CSS class.
		this.showOnly = function(id) {
			$('.showOnly').each(function(){
				if ( this.id === id ) {
					$(this).show();
				}
				else {
					$(this).hide();
				}
			});
		};

        // Instantiates the Model object that fits the current role.
		this.createModel = function(role) {
            var model;
			if ( role === 'baby' ) {
				model = new BPST.Sender();
			}
			else {
				model = new BPST.Receiver();
			}
            model.setRole(role);
            return model;
		};		

        // Assigns listeners to Model and runs it.
		this.run = function () {
			var model = this.createModel(this.getRole());
			model.setStatusListener(this.logStatus);
			model.setActionListener(this.logAction);
			model.setControlsListener(this.toggleButton);
			model.setMessageListener(this.update);
			model.run();			
		};		
	}
	BPST.Controller = Controller;
})();