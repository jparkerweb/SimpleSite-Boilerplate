// CommonJS exports (public functions)
module.exports = {
	init: init
};

function init() {	
	smoothScroll.init({
		speed: 500,
		easing: 'easeInOutCubic',
		updateURL: true,
		offset: 30,
		callbackAfter: function ( toggle, anchor ) {
			// custom callback to fix scroll position for 
			//  when the toggle was clicked before nav was fixed top
			smoothScroll.animateScroll( toggle, anchor, { 
				"speed": 200,
				"easting": "easeInOutCubic",
				"offset": 30
			});
		}
	});
};