var express = require('express');
var router = express.Router();

/* GET redirect following routes to home page. */

router.get('/', function(req, res, next) {
  res.redirect("/books/all/1")
});

router.get('/books', function(req, res, next) {
  res.redirect("/books/all/1")
});

module.exports = router;
