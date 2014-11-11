// Author: Angel Samano <angel@theflashchemist.com>
// Filename: files/scripts/dependencies/model.js

define(function(require) {
	var Backbone = require('backbone'),
		Model = Backbone.Model.extend({

			// NOTE: Please review the "ajaxPrefilter" function declared in the "scripts/functions.js" file
			// This is because we are faking a RESTful endpoint (created using PHP)
			// Not need to say the endpoint is not actually an API endpoint but a php file (index.php)
			url: '/service/basic-api',
			parse: function(data) {
				var currentMonth = $.getCurrentDateString('YYYY-MM'),
					totalCapacity = 0,
					that = this;

				$.each(data.results, function(index, value) {

					// The following code just represent the ability to play around with the API response
					// Removing unnecessary blank spaces and correcting data types
					this.startDay = $.trim(value['startDay']);
					this.endDay = $.trim(value['endDay']);
					this.capacity = Number(value['capacity']);
					this.monthlyPrice = Number(value['monthlyPrice']);

					// Doing this to avoid unnecessary processing time on execution.
					// We know as a fact that the source file won't change, so we know the total capacity of our 'offices'
					totalCapacity += this.capacity;
				});

				// Adding the current month if not present in the file

				// TODO: A nice to have idea - validate if today is the last day of the current month to remove the 'projection' label of this 
				// also we are supposing the source will be always updated, if that is not the case, we will have the following issue:
				// If the current month is bigger than the last month listed in the API response, this projection will be incorrect
				if (!_.contains(data.metadata.uniqueListedMonths, currentMonth)) {
					data.metadata.uniqueListedMonths.push(currentMonth);
				}

				data.metadata.totalCapacity = totalCapacity;
				return data;
			}
		});

	return Model;
});