main-manage = let

	rotateDisplay = null

	_init-depend-module = !->
		rotateDisplay := require "./rotateDisplay.js"

	_init-rotate = !->
		elem = [0, 1, 2, 3, 4]
		for i in [0 to 99]
			elem.sort (a, b)-> return (Math.random() > 0.5 ? a : b)
		for dom, i in $ ".pic-display-list li .display-pic"
			dom.style.backgroundImage = "url('/images/rotate/rotate-#{elem[i]}.jpg')"
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