/*jslint node: true*/
/*jslint white: false*/
"use strict";

var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
	tools = require('./tools.js');

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

module.exports = {

	port: undefined,

	server: undefined,

	makeServer: function (portParam) {


		var httpaccessrules,
			server,
			lastHTRloadTime,
			currentServerTime;

		function loadhttpaccessrules() {

			try {
				httpaccessrules = JSON.parse(fs.readFileSync('httpaccessrules.json'));
			} catch (e1) {
				throw e1;
			}

			if (httpaccessrules.ignore === undefined
					|| httpaccessrules.ignore[0].type === undefined
					|| httpaccessrules.ignore[0].value === undefined) {
				console.error('Your httpaccessrules.json doesn\'t exist! Proceeding...');
			}

			httpaccessrules.ignore.forEach(function (value, index, array) {
				switch (value.type) {
				case 'regex':
					console.log(array[index]);
					array[index] = new RegExp(value.value);
					console.log(array[index]);
					break;
				case 'string':
					array[index] = value.value;
					break;
				default:
					console.log('httpaccessrules.json ignore array has invalid type',
								value.type, 'at index', index);
					break;
				}
			});
		}


		lastHTRloadTime = new Date();
		loadhttpaccessrules();

		server = http.createServer(function (req, res) {

			currentServerTime = new Date();
			if (currentServerTime.getTime() - lastHTRloadTime.getTime() > 10000) {
				lastHTRloadTime = currentServerTime;
				loadhttpaccessrules();
				console.log('Reloaded httpaccessrules.json!');
			}

			console.log('GET: ' + req.url);

			httpaccessrules.ignore.forEach(function (ignoreuri, index) {
				var currentMatchResult = req.url.match(ignoreuri);
				if (currentMatchResult !== null && currentMatchResult[0] === currentMatchResult.input) {
					console.log("IGNORE: " + req.url);
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.write('You don\'t have permission to access ' + req.url + ' on this server.');
					res.end();
					return;
				}
			});

			switch (req.url.slice(-1)) {
			case '/':
				req.url += 'index.html';
				break;
			case '?':
				res.writeHead(308, {Refresh: '0; url=' + req.url.slice(0, req.url.length - 1)});
				res.end();
				return;
			default:
				break;
			}
			req.url = '/www' + req.url;

			var uri = url.parse(req.url).pathname,
				filename = path.join(process.cwd(), uri);
			fs.exists(filename, function (exists) {
				if (!exists) {
					console.log("ENOENT: " + filename);
					res.writeHead(404, {'Content-Type': 'text/plain'});
					res.write('404 Not Found\n');
					res.end();
					return;
				}
				var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
				res.writeHead(200, mimeType);

				try {
					res.write(fs.readFileSync(filename));
				} catch (e2) {
//						switch (e.code) {//possibilities
//						default:
//							throw e;
//						}
					throw e2;//temp
				}

				res.end();
			}); //end fs.exists
		});

		module.exports.port = tools.optionalParam(portParam, 1337);

		try {
			server.listen(module.exports.port);
		} catch (e3) {
			switch (e3.code) {
			case 'EADDRINUSE':
				console.log('Port ' + module.exports.port + ' is already in use.');
				server.close();
				return;
				//break;
			default:
				throw e3;
				//break;
			}
		}

		this.server = server;

		return server;
	} //end makeServer()

};
