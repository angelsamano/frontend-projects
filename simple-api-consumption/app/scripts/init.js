// Author: Angel Samano <angel@theflashchemist.com>
// Filename: files/scripts/init.js

requirejs.config({
    enforceDefine: true,
    paths: {
        jquery: [
            '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
            'vendor/jquery-min'
        ],

        underscore: [
            '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min',
            'vendor/underscore-min'
        ],

        backbone: [
            '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
            'vendor/backbone-min'
        ],

        jqueryUI: [
            '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min',
            'vendor/jquery-ui.min'
        ],

        bootstrap: [
            '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.0/js/bootstrap.min',
            'vendor/bootstrap.min'
        ],

        typeahead: [
            '//twitter.github.io/typeahead.js/releases/latest/typeahead.bundle',
            'vendor/typeahead.bundle'
        ],

        functions: 'functions'
    },

    // Using shims to:
    //  - Merge our custom jQuery plugins and ad-hoc functions into jQuery declaration
    //  - Load required script dependencies for typeahed.js
    //  - Backbone.JS dependencies: these script dependencies should be loaded before loading backbone.js  
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: '$.fn.dropdown'
        },

        'typeahead': {
            deps: ['jquery', 'jqueryUI', 'bootstrap'],
            exports: '$.fn.typeahead'
        },

        'backbone': {
            deps: ['jquery', 'underscore']
        }
    }
});


define(function(require) {
    var $ = require('functions'),
        Application = require('dependencies/application');

    Application.initialize();
});