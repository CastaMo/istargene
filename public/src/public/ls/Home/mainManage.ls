main-manage = let

	rotateDisplay = null

	_init-depend-module = !->
		rotateDisplay := require "./rotateDisplay.js"

	_init-rotate = !->
		new rotateDisplay {
			displayCSSSelector: ".pic-display-list"
			chooseCSSSelector: ".pic-controll-list"
			delay: 3000
			leftArrowCSSSelector: ".left-arrow"
			rightArrowCSSSelector: ".right-arrow"
		}

	initial: !->
		_init-depend-module!
		_init-rotate!

module.exports = main-manage