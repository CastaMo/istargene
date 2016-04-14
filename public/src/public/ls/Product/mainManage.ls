main-manage = let

	rotateDisplay = null

	_init-depend-module = !->
		rotateDisplay := require "./rotateDisplay.js"

	initial: !->
		_init-depend-module!
		new rotateDisplay {
			displayCSSSelector: ".pic-display-list"
			chooseCSSSelector: ".pic-controll-list"
			delay: 3000
			leftArrowCSSSelector: ".left-arrow"
			rightArrowCSSSelector: ".right-arrow"
		}

module.exports = main-manage