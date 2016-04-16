rotate-display = let
	[deepCopy, query, addListener, querys] = [util.deepCopy, util.query, util.addListener, util.querys]
	picWidth = 1023
	compatibleCSSConfig = [
		""
		"-webkit-"
		"-moz-"
		"-ms-"
		"-o-"
	]
	class Base
		(options)->
			deepCopy options, @
			@init()

		init: ->

	class rotateDisplay extends Base

		_getCompatibleTranslateCss = (ver, hor)->
			result_ = {}
			for config in compatibleCSSConfig
				result_["#{config}transform"] = "translate3d(#{ver}, #{hor}, 0)"
			result_

		_getCompatibleDurationCss = (isMove = false)->
			result_ = {}
			if isMove
				for config in compatibleCSSConfig
					result_["#{config}transition"] = "all 0 linear"
			else
				for config in compatibleCSSConfig
					result_["#{config}transition"] = "all 0.3s ease-in-out"
			result_

		_autoRotateEvent = (rotateDisplay)->
			self = rotateDisplay

			###
			# 监视autoFlag
			###
			if not self._autoFlag then self._autoFlag = true
			else
				index = (self.currentChoose + 1) % self.activityNum
				self.setCurrentChooseAndTranslate(index)
			setTimeout(->
				_autoRotateEvent(self)
			, self.delay)


		###
		# 图片轮转播放
		# @param {Object} options: 组件配置
		#
		# 调用方法:
		# 直接通过构造函数，传入对应的对象配置即可。
		# displayCSSSelector为图片所在的ul的css选择器
		# chooseCSSSelector为图片对应的标号索引所在的ul的css选择器
		# delay为图片每次轮转的时间
		###

		(options)->
			@displayUlDom = query options.displayCSSSelector
			@chooseUlDom = query options.chooseCSSSelector
			@leftArrowDom = query options.leftArrowCSSSelector
			@rightArrowDom = query options.rightArrowCSSSelector
			super options

		init: ->
			@initDisplay()
			@initChoose()
			@initAutoRotate()

		initDisplay: ->
			@displayContainerDom = @displayUlDom.parentNode
			@displayContainerDom.style.overflowX = "hidden"
			@allDisplayDom = querys "li", @displayUlDom

			###
			# 让所有的图片的宽度都能适应屏幕
			###

			for dom in @allDisplayDom
				dom.style.width = "#{picWidth}px"
			@activityNum = @allDisplayDom.length

			###
			# 扩充图片所在ul的长度
			###
			@displayUlDom.style.width = "#{picWidth * @activityNum}px"

		initChoose: ->
			@chooseUlDom.parentNode.style.overflow = "hidden"
			self = @
			@allChooseDom = querys "li", @chooseUlDom
			@currentChoose = 0
			@allChooseDom[0].className = "active"
			for let dom, i in @allChooseDom
				addListener dom, "click", (e)-> e.preventDefault(); e.stopPropagation(); self._autoFlag = false; self.setCurrentChooseAndTranslate(i)
			addListener @leftArrowDom, "click", (e)-> e.preventDefault(); e.stopPropagation(); self._autoFlag = false; self.setCurrentChooseAndTranslate(self.currentChoose - 1)
			addListener @rightArrowDom, "click", (e)-> e.preventDefault(); e.stopPropagation(); self._autoFlag = false; self.setCurrentChooseAndTranslate(self.currentChoose + 1)

		initAutoRotate: ->
			###
			# autoFlag用于监视是否有人工操作，如果有，则当前最近一次不做播放，重新设置autoFlag，使得下一次播放正常进行
			###
			self = @
			@_autoFlag = true
			setTimeout(->
				_autoRotateEvent(self)
			, self.delay)

		setCurrentChoose: (index)->
			@allChooseDom[@currentChoose].className = "inactive"
			@allChooseDom[index].className = "active"
			@currentChoose = index

		setTransitionForDisplayUlDom: (isMove)->
			compatibleDurationCss = _getCompatibleDurationCss isMove
			for key, value of compatibleDurationCss
				@displayUlDom.style[key] = value

		translateForDisplayUlDom: (ver = 0, hor = 0)->
			compatibleTranslateCss = _getCompatibleTranslateCss(ver, hor)
			for key, value of compatibleTranslateCss
				@displayUlDom.style[key] = value

		setCurrentChooseAndTranslate: (index)->
			index = (index + @activityNum) % @activityNum
			transIndex =  -1 * index
			@translateForDisplayUlDom("#{transIndex * picWidth}px", 0)
			@setCurrentChoose(index)

	return rotateDisplay
	
module.exports = rotateDisplay
