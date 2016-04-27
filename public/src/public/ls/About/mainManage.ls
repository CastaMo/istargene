main-manage = let

	[addListener] = [util.addListener]

	rotateDisplay = null
	page = null

	_init-depend-module = !->
		rotateDisplay := require "./rotateDisplay.js"
		page := require "./pageManage.js"

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

	_init-page-toggle = !->
		_all-choose = $ "\#all-info .choose-list li"
		for let dom, i in _all-choose
			$(dom).click -> window.location.hash = i

	_check-hash = ->
		num = window.location.hash
		if num = num.replace("#", "")
			page.toggle-page num

	_init-hash-event = ->
		addListener window, "popstate", -> _check-hash!

	initial: !->
		_init-depend-module!
		_init-rotate!
		_init-page-toggle!
		_check-hash!
		_init-hash-event!
module.exports = main-manage