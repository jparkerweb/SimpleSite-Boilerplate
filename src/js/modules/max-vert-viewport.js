// CommonJS exports (public functions)
module.exports = maxVertViewport;

function maxVertViewport(headerSelector, navSelector) {
	var windowHeight = $(window).height(),
		navHeight = $(navSelector).outerHeight();

	$(headerSelector).outerHeight(windowHeight - navHeight);
};	