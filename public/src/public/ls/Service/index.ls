let win = window, doc = document


	_init-all-module = !->
		page = require "./pageManage.js";			page.initial!
		main = require "./mainManage.js";			main.initial!

	_init-all = ->
		_init-all-module!

	_init-all!

