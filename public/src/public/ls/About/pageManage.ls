page-manage = let
	_state = null

	$("\#istargene-head-nav .choose-container li\#about-page-field").addClass "choose"


	_all-choose = $ "\#all-info .choose-list li"

	_all-content = $ "\#all-info .info-list li"

	_unchoose-all = ->
		_all-choose.each ->
			$(@).remove-class "choose"
	_hide-all = ->
		_all-content.each ->
			$(@).fade-out 200

	_toggle-page-callback = (seq-num)->
		_unchoose-all!
		_hide-all!
		$(_all-choose[seq-num]).add-class "choose"
		set-timeout (-> $(_all-content[seq-num]).fade-in 200), 200
		
	initial: ->

	toggle-page: (seq-num)-> _toggle-page-callback seq-num

module.exports = page-manage
