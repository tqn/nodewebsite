/*jslint node: true */
/*jslint white: false*/
"use strict";

var http = require('http'),
	os = require('os'),
	tools = require('./tools.js'),
	myServer = require('./server.js');





myServer.makeServer();

//find local ip (192.168...)

function logprivateifaces(ifacearray) {

	var privateifaces = [];

	ifacearray.forEach(function (pair, index) {

		var ifname = pair.ifname,
			address = pair.address;


		function ipcomp(compare) {
			return (address.slice(0, compare.length) === compare);
		}

		if (ipcomp('192.168.') || ipcomp('172.16.') || ipcomp('172.31.') || ipcomp('10.')) { //USE REGEX TO MATCH LOCAL IPs
			privateifaces.push({ifname: ifname, address: address});
		}

	});

	return privateifaces;

}

var privateifaces = logprivateifaces(tools.localIp());

console.log(privateifaces);

if (privateifaces.length === 0) {
	console.log('No private IP addresses available. Server will run locally.');
	console.log('HTTP Static File Server running at http://localhost:' + myServer.port + '/');
} else {
	console.log('HTTP Static File Server running at http://' + privateifaces[0].address + ':' + myServer.port + '/');
}


