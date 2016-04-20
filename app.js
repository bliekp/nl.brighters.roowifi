"use strict";

function init() {
	
	Homey.log("RooWiFi app active!");

        Homey.manager('speech-input').on('speech', function( speech, callback ) {
/*
            {
                "transcript": "clean", (everything Homey has heard after 'OK Homey' until silence)
                "language": "en", // the spoken language
                "triggers": [
                    {
                        "id": "clean", // this ID corresponds with the ID in your app.json
                        "position": 1, // position of first character in the complete sentence
                        "text": "clean"
                    },
                    {
                        "id": "dock",
                        "position": 1,
                        "text": "dock"
                    }
                ],
                //"devices": [ { id: "abcd" }], // list of device_data objects of founds devices. If one or more zones are mentioned, only devices in those zones are returned
                //"time": false, // contain a time when a time or date has been found in the sentence
                "agent": "homey:app:nl.brighters.roowifi" // your app's URI
            }
        
*/


            // loop all triggers
            speech.triggers.forEach(function(trigger){
                if( trigger.id == 'clean' ) {
        
                    // speak the weather
                    Homey.manager('speech-output').say( "Ok, I'll ask Roomba to start cleaning!" );
        
        
                } else if( trigger.id == 'dock' ) {
                    Homey.manager('speech-output').say( "Ok, I'll ask Roomba to return to it's dock!" );
                }
        
            });
        
            // null, true when speech was meant for this app
            // true, null when speech wasn't meant for this app
            callback( null, true );
        
        });	
}

module.exports.init = init;
