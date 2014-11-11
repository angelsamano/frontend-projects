// Author: Angel Samano <angel@theflashchemist.com>
// Filename: files/scripts/dependencies/application.js

define(function(require) {
	var Router = require('dependencies/router'),
		initialize = function() {
			Router.initialize();
		};

	return {
		initialize: initialize
	};
});