var BPST = BPST || {};
(function(){

	function Controller() {

		var role = 'baby';
		var uuid = Math.uuid(6);
		var session; // is set later
		var baseUrl = 'http://192.168.178.17:8080/';
		this.maxAttempts = 10;
		this.intervalMs = 1000;

        // Triggered after radio button selection is confirmed. Reads
        // selected role, advances UI to challenge/response fields.
		this.setRole = function () {
			role = $("input[type='radio'][name='role']:checked").val();

            // Insert UUID in field that corresponds with selected role
			$('.sessionPart').each(function(){
				if ( this.id === role ) {
					$(this).val(uuid);
                    $(this).prop('readonly',true);
                }
                else {
                    $(this).val('Enter code');
                    $(this).prop('readonly',false);

                    /*
                    // on focus: clear field
                    $(this).on('focus',function(){
                        if ( $(this).val() === 'Enter code' ) {
                            $(this).val('');
                        }
                    });

                    // on blur: add tooltip
                    $(this).on('blur',function(){
                        if ( $(this).val() === '' ) {
                            $(this).val('Enter code');
                        }
                    });
                    //*/
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

        // Performs GET request with data query string,
        // passes returned JSON to provided handler function.
		this.update = function (requestData,responseHandler) {

            /*
            XXX it appears that phonegap serve creates a sandbox
            from whence escape is only possible by jumping through
            hoops that we haven't figured out yet. This is further
            complicated by the fact that we are doing a cross-domain
            AJAX request, which is already limited.
             */
            $.mobile.allowCrossDomainPages = true;
            $.support.cors = true;
            var url = baseUrl + session;
            console.log("going to get JSON from "+url);
			$.ajax({
				type     : 'GET',
				url      : url,
				success  : function(text){responseHandler(JSON.parse(text))},
				dataType : 'text',
				data     : requestData,
				error    : function(xhr,status,err) {
					self.logAction('retrying');
					self.logStatus('error!');
                    console.log('status: '+status);

                    // these fail to return anything on phonegap
                    console.log('statusText: '+xhr.statusText);
                    console.log('headers: '+xhr.getAllResponseHeaders());
				}
			});
        };

        // Attempts to establish session by handshake iterations.
		this.startSession = function() {
			var self = this;
			session = $('#baby').val() + $('#parent').val();
            console.log("Session ID: "+session);
	
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
                        console.log('polling attempt '+attempts);
				
						// have seen other actor
						if ( data.role !== self.role ) {
							self.logAction('standing by');
							self.logStatus('ready');		
							self.showOnly('run');		
							clearInterval(intervalId);
						}
                        else {
                            console.log('retrieved: '+data);
                        }
						if ( attempts == self.maxAttempts ) {
							alert('giving up');
							clearInterval(intervalId);
						}		
					}
				);
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