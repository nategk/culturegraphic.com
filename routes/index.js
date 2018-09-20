var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // render
  res.render('index', {
    title: 'Nate Kerksick'
  });
});

module.exports = router;
