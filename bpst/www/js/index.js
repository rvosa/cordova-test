/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var c = new BPST.Controller();
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        // attach touch events
        $('#setRole').on( 'touchstart', function(event){ c.setRole() });
        $('#backToRole').on( 'touchstart', function(event){c.showOnly('role')});
        $('#startSession').on( 'touchstart', function(event){ c.startSession() });
        $('#backToSession').on( 'touchstart', function(event){c.showOnly('session')});
        $('#run').on( 'touchstart', function(event){ c.run() });
        console.log('Attached touch events');
        
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */
        c.showOnly('role');
        console.log('Received Event: ' + id);

        // deal with iOS7 statusbar offset
        if ( device.platform === 'iOS' && device.version >= 7.0 && device.version < 8.0 ) {
            console.log('iOS7.* variant, adding status bar margin');
            $('.app').each(function(){
                this.style.paddingTop = '15px';
            });
        }
    },
    
    /*
    tmpFile : "myrecording.wav",
    record : function() {
    	console.log('Recording');
		var media = new Media(this.tmpFile,
			// success callback
			function() {
				console.log("recordAudio():Audio Success");
			},

			// error callback
			function(err) {
				console.log("recordAudio():Audio Error: "+ err.code);
			}
		);

		// Record audio
		setTimeout(function(){media.stopRecord()},1000);
		media.startRecord();
    },
    play : function() {
    	console.log('Playing');
		var media = new Media(this.tmpFile,
			// success callback
			function() {
				console.log("play():Audio Success");
			},

			// error callback
			function(err) {
				console.log("play():Audio Error: "+ err.code);
			}
		);
		media.play();    	
    }
    */
};
