'use strict';

var fs = require('fs');
var milu = require('milu');
var path = require('path');

module.exports = function (config) {
	config = config || {};
	
	var root = path.resolve(config.root || './');
	var	base = config.base || '';
	var verb = {};
	var pipeline;
	
	fs.readdirSync(path.join(__dirname, 'filter')).forEach(function (name) {
		verb[name] = require('./filter/' + name);
	});

	(pipeline = milu(verb))
		.prepare(root, base)
		.is('.js').then
			.bomless()
			.nocomment()
			.resolve()
			.modular()
			.end
		.is('.css').then
			.bomless()
			.nocomment()
			.resolve()
			.require()
			.absolute()
			.end
		.is('.tpl').then
			.bomless()
			.tplc()
			.modular()
			.end
		.is('.json').then
			.bomless()			
			.jsonc()
			.modular()
			.end;
	
	return function (relative, data, callback) {
		pipeline.run({
			relative: relative,
			data: data
		}, function (err) {
			callback(err, this.data);
		});
	};
};