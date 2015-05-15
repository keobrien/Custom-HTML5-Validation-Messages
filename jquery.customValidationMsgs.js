/*
Project Name: Custom HTML5 Validation Messages
URL: 
Author: Kevin O'Brien
Company: Clockwork Acive Media Systems
Company Site: clockwork.net
License: MIT
Copyright (C) 2013 Clockwork Active Media Systems
Version: 1.0
**************************************/

(function ($) {

	"use strict";

	// These locally scoped variables help minification by aliasing strings
	var data_key                   =  'customValidationMsgs-options', // Namespace plugin data
		event_suffix               =  '.customValidationMsgs',        // Namspace events

		// Custom events
		evt_component_initialized  =  'component_initialized' + event_suffix, // Cusotm event when plugin is done initializing
		evt_request_validation     =  'request_validation' + event_suffix,
		
		// Global variables shared across all instances
		useragent                  = navigator.userAgent;

	// Scope Methods
	var methods  =  {

		// Ran when plugin is initialized for setup
		init  :  function (settings) {

			var $el  =  $(this),
				// Options added here are defaults, if different values are passed when initiallized, these will be overridden
				options  =  $.extend({
					validation_types  :  ['valueMissing', 'typeMismatch', 'patternMismatch', 'tooLong', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'valid'],
					type              :  this.nodeName.toLowerCase()
				}, settings);

			// As of Opera v11.6 @font-face makes validation message dissapear
			if(useragent.indexOf('Opera') != -1) { $el.addClass('opera'); }

			$el
				// Store data on the element for use later
				.data(data_key, options)
				// Adds listeners to form
				.customValidationMsgs('activate_listeners')
				// Triggers custom validation event on all supported elements in form
				.customValidationMsgs('validate_form')
				// Broadcasts component initiallized event
				.trigger(evt_component_initialized, options);

			return this;
		},

		activate_listeners: function(){

			var $el      =  $(this),
				options  =  $el.data(data_key);

			$el
				.on('input'  + event_suffix, 'input, select, textarea', methods._handle_validation_request)
				.on('change' + event_suffix, 'input, select, textarea', methods._handle_validation_request)
				.on(evt_request_validation, 'input, select, textarea', methods._handle_validation_request)

			return this;
		},

		validate_form: function(){
		
			$(this).find('input, select, textarea').each(function(){
				$(this).trigger(evt_request_validation)
			})
		
		},

		_handle_validation_request: function(evt){

			var $el      =  $(evt.delegateTarget),
				options  =  $el.data(data_key),
				$input   =  $(this);

			if(! this.validity) return;
			
			// Defines a new custom validation type, matches one field to another (like confirm password)
			//
			// example: <input type="text" name="pass" id="pass" data-validateMatch="true" data-matchingValues_id="confirm_pass" required />
			//          <input type="text" name="confirm_pass" id="confirm_pass" data-validateMatch="true" data-matchingValues_id="pass" required />
			if($input.attr('data-validateMatch')) {
				if($('#'+input.attr('data-matchingValues_id')).val() != $input.val()) {
					this.setCustomValidity(this.data('matchingValues'));
					return this;
				}else { this.setCustomValidity(null) }
			}

			// Converts supported validation messages to a custom validation message if one is available in the data attribute
			for(var i = 0; i < options.validation_types.length; i++) {
				var msg = $input.attr( 'data-' + options.validation_types[i] );

				if(this.validity[options.validation_types[i]] && msg) {
					this.setCustomValidity(msg);
					break;
				}else { this.setCustomValidity("") }
			}

			return this;
		}
	};

	$.fn.customValidationMsgs  =  function (method) {

		/**
		* Used to prevent use of functions prefixed with an underscore
		* if a method is provided call that, otherwise treat it as an initiation
		* Do not edit below this
		**/
		var args  =  arguments;
        if (methods[method] && method.charAt(0) !== '_') {
            return $(this).map(function(i, val) { return methods[method].apply(this, Array.prototype.slice.call(args, 1)); });
        } else if (typeof method === 'object' || !method) {
            return $(this).map(function(i, val) { return methods.init.apply(this, args); });
        }
	};

}(jQuery));