
var express = require('express'),
	app     = express(),
	router  = express.Router(),
	renew   = require('../renew');

module.exports = function(passport) {

	router.get('/', function(req, res) {
		res.render('./Home/develop');
	});

	router.get('/Product', function(req, res) {
		res.render('./Product/develop');
	});

	router.get('/Service', function(req, res) {
		res.render('./Service/develop');
	});

	router.get('/Coverage', function(req, res) {
		res.render('./Coverage/develop');
	});

	router.get('/About', function(req, res) {
		res.render('./About/develop');
	});

	router.get('/Story', function(req, res) {
		res.render('./Story/develop');
	});

	router.get('/Purchase/SingleBasic', function(req, res) {
		res.render('./Purchase/SingleBasic/develop');
	});

	router.get('/Purchase/SingleUpgrade', function(req, res) {
		res.render('./Purchase/SingleUpgrade/develop');
	});

	router.get('/Purchase/TotalBasic', function(req, res) {
		res.render('./Purchase/TotalBasic/develop');
	});

	return router;
};