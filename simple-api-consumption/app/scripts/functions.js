define(function(require) {
	var $ = require('jquery'),
		_ = require('underscore'),

		// Private functions, we don't need these one anywhere in the main application (so far...)
		getCurrentDateWithFormat = function(format) {
			var date = new Date(),
				yyyy = date.getFullYear().toString(),
				mm = (date.getMonth() + 1).toString(),
				dd = date.getDate().toString(),
				mmChars = mm.split(''),
				ddChars = dd.split(''),
				datestring = yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);

			if (format === 'YYYY-MM') {
				datestring = yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]);
			}

			return datestring;
		};

	// We need a prefilter because I am using a fake API endpoint. A PHP file actually
	$.ajaxPrefilter(function(options, originalOptions, XHRQuery) {
		options.url = 'api/index.php';
	});

	var Functions = _.extend($, {
		dateBetweenRange: function(date, start, end) {
			var endDate = (!end) ? getCurrentDateWithFormat('YYYY-MM-DD') : end,
				dates = {
					from: $.datepicker.parseDate('yy-mm-dd', start),
					to: $.datepicker.parseDate('yy-mm-dd', endDate),
					value: $.datepicker.parseDate("yy-mm-dd", date)
				},
				results = (dates.value <= dates.to && dates.value >= dates.from);

			if (!results) {
				// The contract for this one happens after the first day of the month
				var sameMonth = (date.substr(0, date.length - 3) === start.substr(0, start.length - 3));
				if (sameMonth) {
					results = true;
				} else {
					console.log(date + ' is out of range [ from ' + start + ' to ' + endDate + ']');
				}
			}

			return results;
		},

		daysInMonth: function(month, array) {
			var days = 1;
			$.each(array, function(index, value) {
				if (this.month === month) {
					days = Number(this.days);
					return false;
				}
			});
			return days;
		},

		getCurrentDateString: function(format) {
			var results = getCurrentDateWithFormat('YYYY-MM');

			return results;
		},

		// Helper function. Don't use this for the production realease
		displayHelpInConsole: function(data) {
			var results = {
				'Unit Capacity': data.capacity,
				'From': data.startDay,
				'To': data.endDay,
				'Monthly Price': data.monthlyPrice
			};

			console.log(results);
		},

		// String related functions
		stringToCurrency: function(amount) {
			var results = parseFloat(amount, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			return '$' + results.toString();
		},

		substringMatcher: function(strs) {
			return function findMatches(q, cb) {
				var substrRegex = new RegExp(q, 'i'),
					matches = [];

				$.each(strs, function(i, str) {
					if (substrRegex.test(str)) {
						matches.push({
							value: str
						});
					}
				});

				cb(matches);
			};
		}
	});

	return Functions;
});