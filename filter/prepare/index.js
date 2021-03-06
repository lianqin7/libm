'use strict';

var path = require('path');

module.exports = function (root, base) {
	return function (next, done) {
		this.type = path.extname(this.relative);
		this.basedir = path.dirname(path.join(root, this.relative));
		this.relative = path.join(base, this.relative).replace(/\\/g, '/');
		
		next(done);
	};
};