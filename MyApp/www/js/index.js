var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);

        // Ensure Cordova and the Diagnostic plugin are ready
        if (window.cordova) {
            console.log('Cordova is available.');
            
            if (cordova.plugins) {
                console.log('Cordova plugins are available.');

                if (cordova.plugins.diagnostic) {
                    console.log('Diagnostic plugin is available.');
                    this.checkDiagnostics();
                } else {
                    console.error('Diagnostic plugin not available');
                }
            } else {
                console.error('Cordova plugins not available');
            }
        } else {
            console.error('Cordova not available');
        }
    },

    checkDiagnostics: function() {
        console.log('Checking diagnostics...');
        
        cordova.plugins.diagnostic.requestRuntimePermissions(function(statuses) {
            for (var permission in statuses) {
                switch (statuses[permission]) {
                    case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                        console.log("Permission granted to use " + permission);
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                        console.log("Permission to use " + permission + " has not been requested yet");
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.DENIED:
                        console.log("Permission denied to use " + permission + " - ask again?");
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                        console.log("Permission permanently denied to use " + permission + " - guess we won't be using it then!");
                        break;
                }
            }
        }, function(error) {
            console.error("The following error occurred: " + error);
        }, [
            cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION,
            cordova.plugins.diagnostic.permission.ACCESS_COARSE_LOCATION
        ]);
    }
};

app.initialize();
