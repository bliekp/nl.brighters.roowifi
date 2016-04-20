
module.exports.init = function( devices_data, callback ) {

    // when the driver starts, Homey rebooted. Initialize all previously paired devices.
    devices_data.forEach(function(device_data){
        // do something here to initialize the device, e.g. start a socket connection
    })

    // let Homey know the driver is ready
    callback();
}        

module.exports.capabilities = {
    clean: {

        // this function is called by Homey when it wants to GET the dim state, e.g. when the user loads the smartphone interface
        // `device_data` is the object as saved during pairing
        // `callback` should return the current value in the format callback( err, value )
        get: function( device_data, callback ){

            // send the value to Homey
            if( typeof callback == 'function' ) {
                callback( null, bulb.state.dim );
            }
        },

        // this function is called by Homey when it wants to SET the dim state, e.g. when the user says 'red lights'
        // `device_data` is the object as saved during pairing
        // `dim` is the new value
        // `callback` should return the new value in the format callback( err, value )
        set: function( device_data, callback ) {
            // send the new value to Homey
            if( typeof callback == 'function' ) {
                callback( null, bulb.state.dim );
            }
        }
    }
    dock: {
        // this function is called by Homey when it wants to GET the dim state, e.g. when the user loads the smartphone interface
        // `device_data` is the object as saved during pairing
        // `callback` should return the current value in the format callback( err, value )
        get: function( device_data, callback ){

            // send the value to Homey
            if( typeof callback == 'function' ) {
                callback( null, bulb.state.dim );
            }
        },

        // this function is called by Homey when it wants to SET the dim state, e.g. when the user says 'red lights'
        // `device_data` is the object as saved during pairing
        // `dim` is the new value
        // `callback` should return the new value in the format callback( err, value )
        set: function( device_data, callback ) {
            // send the new value to Homey
            if( typeof callback == 'function' ) {
                callback( null, bulb.state.dim );
            }
        }
    }

}

module.exports.renamed = function( device_data, new_name ) {
    // run when the user has renamed the device in Homey.
    // It is recommended to synchronize a device's name, so the user is not confused
    // when it uses another remote to control that device (e.g. the manufacturer's app).
}

module.exports.deleted = function( device_data ) {
    // run when the user has deleted the device from Homey
}

module.exports.settings = function( device_data, newSettingsObj, oldSettingsObj, changedKeysArr, callback ) {
    // see settings

}

module.exports.settings = function( device_data, newSettingsObj, oldSettingsObj, changedKeysArr, callback ) {
    // run when the user has changed the device's settings in Homey.
    // changedKeysArr contains an array of keys that have been changed, for your convenience :)

    // always fire the callback, or the settings won't change!
    // if the settings must not be saved for whatever reason:
    // callback( "Your error message", null );
    // else
    callback( null, true );

}
