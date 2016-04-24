var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('Home');
});

router.get('/Product', function(req, res, next) {
  	res.render('Product');
});

router.get('/Service', function(req, res, next) {
  	res.render('Service');
});

router.get('/Coverage', function(req, res, next) {
  	res.render('Coverage');
});

router.get('/About', function(req, res, next) {
  	res.render('About');
});

router.get('/Purchase/SingleBasic', function(req, res, next) {
  	res.render('SingleBasic');
});

router.get('/Purchase/SingleUpgrade', function(req, res, next) {
  	res.render('SingleUpgrade');
});

router.get('/Purchase/TotalBasic', function(req, res, next) {
  	res.render('TotalBasic');
});

module.exports = router;
