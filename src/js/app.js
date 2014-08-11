var stickynav = require("./modules/stickynav");
var maxVertViewport = require("./modules/max-vert-viewport");
var smoothScroll = require("./modules/smooth-scroll");
var owlCarousel = require("./modules/owl-carousel");

$(document).ready(function() {
	// set outer hieght of our header to window height minus our nav height
	maxVertViewport("header.hero", "nav.nav");

		// Listen for resize changes
		var resizeId;
		$(window).resize(function () {
			clearTimeout(resizeId);
			resizeId = setTimeout(function () {
				// Get screen size (inner/outerWidth, inner/outerHeight)
				maxVertViewport("header.hero", "nav.nav");
			}, 500);
		});

	// setup sticky nav binding to scrolling
	stickynav.initStickyNav();

	// init smooth scroll vendor plugin
	smoothScroll.init();

	// init owl carousel vendor plugin
	owlCarousel.init();
});
