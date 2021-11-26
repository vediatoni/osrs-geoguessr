/*!
 * Cookie Bar component (https://github.com/kovarp/jquery.cookieBar)
 * Version 1.2.4
 *
 * Copyright 2020 Pavel Kovář - Frontend developer [www.pavelkovar.cz]
 * @license: MIT (https://github.com/kovarp/jquery.cookieBar/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
	throw new Error('Cookie Bar component requires jQuery')
}

/**
 * ------------------------------------------------------------------------
 * Cookie Bar component
 * ------------------------------------------------------------------------
 */

(function ($) {

	// Global variables
	var cookieBar, config;

	// Cookie Bar translations
	var translation = [];

	translation['en'] = {
		message: 'We use cookies to provide our services. By using this website, you agree to this.',
		acceptText: 'OK',
		infoText: 'Privacy Policy',
		privacyText: 'Privacy protection'
	};

	var methods = {
		init: function (options) {
			cookieBar = '#cookie-bar';

			var defaults = {
				infoLink: '/privacypolicy',
				infoTarget: '_blank',
				wrapper: 'body',
				expireDays: 365,
				style: 'top',
				language: $('html').attr('lang') || 'en',
				privacy: false,
				privacyTarget: '_blank',
				privacyContent: null
			};

			config = $.extend(defaults, options);

			if (!translation[config.language]) {
				config.language = 'en';
			}

			if (methods.getCookie('cookies-state') !== 'accepted') {
				methods.displayBar();
			}

			// Accept cookies
			$(document).on('click', cookieBar + ' .cookie-bar__btn', function (e) {
				e.preventDefault();

				methods.setCookie('cookies-state', 'accepted', config.expireDays);
				methods.hideBar();
			});

			// Open privacy info popup
			$(document).on('click', '[data-toggle="cookieBarPrivacyPopup"]', function (e) {
				e.preventDefault();

				methods.showPopup();
			});

			// Close privacy info popup
			$(document).on('click', '.cookie-bar-privacy-popup, .cookie-bar-privacy-popup__dialog__close', function (e) {
				methods.hidePopup();
			});

			$(document).on('click', '.cookie-bar-privacy-popup__dialog', function (e) {
				e.stopPropagation();
			});
		},
		displayBar: function () {
			if (!$.trim($(config.wrapper).html())) {
				$(config.wrapper).empty();
			}

			// Display Cookie Bar on page
			var acceptButton = '<button type="button" class="cookie-bar__btn">' + translation[config.language].acceptText + '</button>';
			var infoLink = '<a href="' + config.infoLink + '" target="' + config.infoTarget + '" class="cookie-bar__link cookie-bar__link--cookies-info">' + translation[config.language].infoText + '</a>';

			var privacyButton = '';
			if (config.privacy) {
				if (config.privacy === 'link') {
					privacyButton = '<a href="' + config.privacyContent + '" target="' + config.privacyTarget + '" class="cookie-bar__link cookie-bar__link--privacy-info">' + translation[config.language].privacyText + '</a>';
				} else if (config.privacy === 'bs_modal') {
					privacyButton = '<a href="' + config.privacyContent + '" data-toggle="modal" class="cookie-bar__link cookie-bar__link--privacy-info">' + translation[config.language].privacyText + '</a>';
				} else if (config.privacy === 'popup') {
					methods.renderPopup();
					privacyButton = '<a href="#" data-toggle="cookieBarPrivacyPopup" class="cookie-bar__link cookie-bar__link--privacy-info">' + translation[config.language].privacyText + '</a>';
				}
			}

			var template = '<div id="cookie-bar" class="cookie-bar cookie-bar--' + config.style + '"><div class="cookie-bar__inner"><span class="cookie-bar__message">' + translation[config.language].message + '</span><span class="cookie-bar__buttons">' + acceptButton + infoLink + privacyButton + '</span></div></div>';

			$(config.wrapper).prepend(template);
			$('body').addClass('has-cookie-bar');
		},
		hideBar: function () {
			// Hide Cookie Bar
			$(cookieBar).slideUp();
			$('body').removeClass('has-cookie-bar');
		},
		renderPopup: function () {
			var popup = $('<div id="cookieBarPrivacyPopup" class="cookie-bar-privacy-popup cookie-bar-privacy-popup--hidden"><div class="cookie-bar-privacy-popup__dialog"><button type="button" class="cookie-bar-privacy-popup__dialog__close"></button></div></div>');
			$('body').append(popup);
			$('.cookie-bar-privacy-popup__dialog', popup).append(config.privacyContent);
		},
		showPopup: function () {
			$('#cookieBarPrivacyPopup').removeClass('cookie-bar-privacy-popup--hidden');
		},
		hidePopup: function () {
			$('#cookieBarPrivacyPopup').addClass('cookie-bar-privacy-popup--hidden');
		},
		addTranslation: function (lang, translate) {
			translation[lang] = translate;
		},
		switchTranslation: function (lang) {
			// Not current lang & just bar
			if (lang !== config.language && !config.privacy) {
				// Check loaded translation
				if (!translation[lang]) {
					config.language = 'en';
				} else {
					config.language = lang;
				}
				// Rebuild bar if it's visible
				if (methods.getCookie('cookies-state') !== 'accepted') {
					methods.displayBar();
				}
			}
		},
		setCookie: function (cname, cvalue, exdays) {
			// Helpful method for set cookies
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			var expires = "expires=" + d.toUTCString();

			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		},
		getCookie: function (cname) {
			// Helpful method for get cookies
			var name = cname + "=";
			var ca = document.cookie.split(';');

			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];

				while (c.charAt(0) === ' ') {
					c = c.substring(1);
				}

				if (c.indexOf(name) === 0) {
					return c.substring(name.length, c.length);
				}
			}

			return '';
		}
	};

	// Create jQuery cookieBar function
	$.cookieBar = function (methodOrOptions) {
		if (methods[methodOrOptions]) {
			return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + methodOrOptions + ' does not exist on Cookie Bar component');
		}
	};
}(jQuery));