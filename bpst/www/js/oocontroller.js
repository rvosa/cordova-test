var BPST = BPST || {};
(function(){

	function Controller() {

		var role = 'baby';
		var uuid = Math.uuid(6);
		var session; // is set later
		var baseUrl = 'http://127.0.0.1:8080/';
		this.maxAttempts = 10;
		this.intervalMs = 1000;

		this.setRole = function () {
			var self = this;	
			role = $("input[type='radio'][name='mode']:checked").val();
			$('#title').text(role);
			$('.sessionPart').each(function(){
				if ( this.id == role ) {
					$(this).text(uuid);
				}
				else {
					$(this).append('<input type="text" size="6" id="password" />');
				}
			});
			this.showOnly('session');
		};
		
		this.getRole = function () {
			return role;
		};	

		this.logStatus = function(statusText) {
			$('#status').text(statusText);
		};

		this.logAction = function(actionText) {
			$('#action').text(actionText);
		};

		this.toggleButton = function(text) {
			$('#start').text(text);
		};

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
				}
			});		
		};

		this.startSession = function() {
			var self = this;		
			var passInput = $('#password');
			var value = passInput.val();
			passInput.replaceWith(value);
			session = $('#baby').text() + $('#parent').text();	
	
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
						if ( data.role != self.role ) {
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

		this.showOnly = function(id) {
			$('.showOnly').each(function(){
				if ( this.id == id ) {
					$(this).show('slow');
				}
				else {
					$(this).hide('slow');
				}
			});
		};
		
		this.createModel = function(role) {
			if ( role == 'baby' ) {
				var model = new BPST.Sender();
				model.setRole(role);
				return model;
			}
			else {
				var model = new BPST.Receiver();
				model.setRole(role);
				return model;
			}
		};		
		
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