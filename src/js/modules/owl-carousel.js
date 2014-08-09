// CommonJS exports (public functions)
module.exports = {
	init: init
};

function init() {	
	$('.owl-carousel').owlCarousel({
		loop: true,
		margin: 10,
		nav: false,
		dots: true,
		items: 1,
		autoplay: true,
		autoplayTimeout: 5000
	})
};