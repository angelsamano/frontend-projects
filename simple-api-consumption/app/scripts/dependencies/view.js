// Author: Angel Samano <angel@theflashchemist.com>
// Filename: files/scripts/dependencies/view.js

define(function(require) {
	var Backbone = require('backbone'),
		Model = require('dependencies/model'),
		View = Backbone.View.extend({

			el: '.content',
			model: new Model(),

			events: {
				'submit .main-form': 'obtainResults'
			},

			render: function() {
				var Typeahead = require('typeahead'),
					that = this;

				this.model.fetch({
					success: function(model) {
						var uniqueListedMonths = model.get('metadata').uniqueListedMonths,
							template = _.template($('#content-template').html());

						that.$el.html(template);

						// Initializing the typeahead component,
						// this needs to be done after rendering the template into the DOM
						$('#date').typeahead({
							hint: true,
							highlight: true,
							minLength: 1
						}, {
							name: 'months',
							displayKey: 'value',
							source: $.substringMatcher(uniqueListedMonths)
						});
					}
				});
			},

			obtainResults: function(event) {
				var that = this,
					userEnteredInput = $('#date').val(),
					resultsArray = this.model.get('results'),
					currentMonth = $.getCurrentDateString('YYYY-MM'),
					numberOfDaysInMonth = $.daysInMonth(userEnteredInput, this.model.get('metadata').allowedInputs),

					totalCapacity = this.model.get('metadata').totalCapacity,
					inputExistInArray = _.some(this.model.get('metadata').allowedInputs, function(element) {
						return element.month === userEnteredInput;
					}),

					template,
					results = {
						revenue: 0,
						capacity: totalCapacity
					};

				// If the input YYYY-MM exist in the array we know we will have data/results
				// Also comparing the input with the months not listed until the current month. Doing this we allow the user to have a projection
				if (inputExistInArray || userEnteredInput === currentMonth) {
					$.each(resultsArray, function(index, value) {
						if ($.dateBetweenRange(userEnteredInput + '-01', this.startDay, this.endDay)) {
							results.capacity -= this.capacity;

							//Calculating the revenue of the month for each unit
							results.revenue += that.calculateRevenue(this, userEnteredInput, numberOfDaysInMonth);
							$.displayHelpInConsole(this);
						}
					});
				}

				template = _.template($('#results-template').html(), {
					variable: 'data'
				})({
					enteredMonth: userEnteredInput,
					monthDetails: (userEnteredInput === currentMonth) ? 'Projected' : numberOfDaysInMonth + ' days',
					usedCapacity: String(totalCapacity - results.capacity) + ' of ' + totalCapacity,
					totalRevenue: $.stringToCurrency(results.revenue),

					hasResults: (results.revenue !== 0),
					unoccupiedCapacity: results.capacity
				});

				this.$('.results').html(template);
				$('#date').val('');

				return false;
			},

			calculateRevenue: function(month, input, daysInMonth) {
				var results = month.monthlyPrice,
					startDay = Number(String(month.startDay).split('-')[2]),
					endDay = Number(String(month.endDay).split('-')[2]),
					undefinedEndDate = (!month.endDay),
					actualBilledDays = daysInMonth,
					dailyCost;

				// Start date for each contract match with the startDate for each unit
				if (input === month.startDay.substr(0, month.startDay.length - 3)) {
					dailyCost = month.monthlyPrice / daysInMonth;

					// If the start day is not the first of the month then we bill using a pro rated price
					if (startDay !== 1) {
						actualBilledDays = daysInMonth - startDay;
						results = dailyCost * actualBilledDays;
					}

					// If the end of the contract is in the current month we only charge the used days
					if (!undefinedEndDate && input === month.endDay.substr(0, month.endDay.length - 3)) {
						if (endDay !== daysInMonth) {
							actualBilledDays = daysInMonth - endDay;
							results = dailyCost * actualBilledDays;
						}
					}
				}

				this.showHelper((actualBilledDays !== daysInMonth), dailyCost, actualBilledDays, results);
				return results;
			},

			// TODO: Instead of using the console, create a float div in the DOM
			showHelper: function(partialPayment, dailyCost, actualBilledDays, results) {
				var type = (partialPayment) ? 'Pro rated' : 'Billed as a Month',
					details = (partialPayment) ? ' ' + $.stringToCurrency(dailyCost) + ' * per day ' + actualBilledDays + ' days' : '';

				console.log(type + details + ' = ' + $.stringToCurrency(results));
			}
		});

	return View;
});