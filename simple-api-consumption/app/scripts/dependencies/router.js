// Author: Angel Samano <angel@theflashchemist.com>
// Filename: files/scripts/dependencies/router.js

define(function(require) {
	var Backbone = require('backbone'),
		View = require('dependencies/view'),
		Router = Backbone.Router.extend({
			routes: {
				'': 'home'
			}
		}),

		initialize = function() {
			var router = new Router();
			router.on('route:home', function() {
				var view = new View();
				view.render();
			});

			Backbone.history.start();
		};

	return {
		initialize: initialize
	};
});