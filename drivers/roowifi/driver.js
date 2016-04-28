"use strict";

var http = require('http');
var tempIP = '';
var tempUN = '';
var tempPW = '';

module.exports.pair = function (socket) {
	// socket is a direct channel to the front-end

	// this method is run when Homey.emit('list_devices') is run on the front-end
	// which happens when you use the template `list_devices`
	socket.on('list_devices', function (data, callback) {

		Homey.log("RooWifi app - list_devices tempIP is " + tempIP);
		Homey.log("RooWifi app - list_devices tempUN is " + tempUN);
		Homey.log("RooWifi app - list_devices tempPW is " + tempPW);

		var devices = [{
			data: {
				id		: tempIP,
				ipaddress 	: tempIP,
				username	: tempUN,
				password	: tempPW
			}
		}];

		callback (null, devices);

	});

	// this is called when the user presses save settings button in start.html
	socket.on('get_devices', function (data, callback) {

		// Set passed pair settings in variables
		tempIP = data.ipaddress;
		tempUN = data.username;
		tempPW = data.password;
		Homey.log ( "RooWifi app - YES! got get_devices from front-end, tempIP =" + tempIP + ", tempUN = " + tempUN + ", tempPW = " + tempPW );

		// assume IP is OK and continue
		socket.emit ('continue', null);

	});

	socket.on('add_device', function (device, callback) {
     console.log('toevoegen apparaat met gegevens:', device)
     callback(null)
   })

	socket.on('disconnect', function(){
		Homey.log("RooWifi app - User aborted pairing, or pairing is finished");
	})
}

// flow action handlers
//
// You have to tweak RooWifi before it can do something new... otherwise it doesn't always do it.

Homey.manager('flow').on('action.start', function( callback, args ){
	sendCommand('CLEAN', args.device.ipaddress, args.device.username, args.device.password, callback);
});


Homey.manager('flow').on('action.gohome', function( callback, args ){
	sendCommand('DOCK', args.device.ipaddress, args.device.username, args.device.password, callback);
});


Homey.manager('flow').on('action.spot', function( callback, args ){
	sendCommand('SPOT' + args.device.ipaddress, args.device.username, args.device.password, callback);
});


// CONDITIONS:

Homey.manager('flow').on('condition.cleaning', function(callback, args){
	getStatus('JSON_ROBOT_STATE="WORKING"', args.device.ipaddress, args.device.username, args.device.password, callback);
});

Homey.manager('flow').on('condition.reachable', function(callback, args){
	getStatus('JSON_ROBOT_STATE', args.device.ipaddress, args.device.username, args.device.password, callback);
});

Homey.manager('flow').on('condition.charging', function( callback, args ){
	getStatus('JSON_ROBOT_STATE="CHARGING"', args.device.ipaddress, args.device.username, args.device.password, callback);
});

Homey.manager('flow').on('condition.pause', function( callback, args ){
	getStatus('JSON_ROBOT_STATE="PAUSE"', args.device.ipaddress, args.device.username, args.device.password, callback);
});

Homey.manager('flow').on('condition.docking', function( callback, args ){
	getStatus('JSON_ROBOT_STATE="DOCKING"', args.device.ipaddress, args.device.username, args.device.password, callback);
});
//

function sendCommand (cmd, hostIP, userName, passWord, callback) {

	Homey.log ("RooWifi app - sending " + cmd + " to " + hostIP);

	http.get({
		  hostname: hostIP,
		  port: 80,
			headers: {
	     Authorization: 'Basic ' + new Buffer(userName + ':' + passWord).toString('base64')
	   },
			path: '/roomba.cgi?button=' + cmd,
		  agent: false
		}, function(res){
		var body = '';
	  res.on('data', function(chunk) {
	    body += chunk;
	    Homey.log("Got data: " + chunk);
	  });
	  res.on('end', function() {
	    Homey.log(body);
	    callback(null, true);
	  });
	}).on('error', function(e) {
	  Homey.log("Got error: " + e.message);
	  callback(null, false);
	});

	Homey.log("Checking the status of the ROOMBA: ");

	getStatus('JSON_ROBOT_STATE="WORKING"', hostIP, userName, passWord, callback);

	Homey.log("done");

}

function getStatus (cmd, hostIP, userName, passWord, callback) {

	Homey.log ("RooWifi app - get roomba.json and compare it to " + cmd + " on " + hostIP);

	http.get({
		  hostname: hostIP,
		  port: 80,
			headers: {
	     'Authorization': 'Basic ' + new Buffer(userName + ':' + passWord).toString('base64')
	   },
		  path: '/roomba.json',
		  agent: false
		}, function(res){
		var body = '';
	  res.on('data', function(chunk) {
	    body += chunk;
	    Homey.log("Got data: " + chunk);
	  });
	  res.on('end', function() {
	    Homey.log(body);

	    if (body.indexOf(cmd) >= 0) {
		    callback(null, true);
		} else {
			callback(null, false);
		}
	  });
	}).on('error', function(e) {
	  Homey.log("Got error: " + e.message);
	  callback(null, false);
	});

	Homey.log("done");

}
