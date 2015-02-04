/*jslint node: true*/
/*jslint white: false*/
"use strict";
var os = require('os');
var ifaces = os.networkInterfaces();


module.exports = {

	optionalParam: function (param, defaultVal) {
		if (typeof param === 'undefined') {
			param = defaultVal;
		} else if (typeof param === 'object' && typeof param.refVal === 'undefined') {
			param.refVal = defaultVal;
		}
		return param;
	},

	ref: function (param) {
		return {refVal: param};
	},

	localIp: function () {

		var cleanif = [];

		Object.keys(ifaces).forEach(function (ifname) {
			var alias = 0;

			ifaces[ifname].forEach(function (iface) {
				if ('IPv4' !== iface.family || iface.internal !== false) {
					// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
					return;
				}

//				if (alias >= 1) {
//					// this single interface has multiple ipv4 addresses
//					console.log(ifname + ':' + alias, iface.address);
//				} else {
//					// this interface has only one ipv4 address
//					console.log(ifname, iface.address);
//
//				}

				cleanif.push({ifname: ifname, address: iface.address});
			});
		});
		return cleanif;
	}

};
