/*jslint node: true */
/*jslint white: false*/
"use strict";

var http = require('http'),
	os = require('os'),
	tools = require('./tools.js'),
	myServer = require('./server.js');





myServer.makeServer(process.env.PORT);

//find local ip (192.168...)

console.log('Server running at port:', process.env.PORT);

