// CommonJS exports (public functions)
module.exports = {
	initStickyNav: initStickyNav
};


function initStickyNav() {
	var headerHeight = ($("header.hero").outerHeight() + 1);
	var $body = $("body");
	$(window).scroll(function () {
		if ($(window).scrollTop() > headerHeight) {
			$body.addClass('nav-fixed-top');
		} else {
			$body.removeClass('nav-fixed-top');
		}
	});
};
