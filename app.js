var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var sequelize = require("./models").sequelize;

var routes = require('./routes/index');
var books = require('./routes/books');

var app = express();

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("404 error");
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// render error
app.use(function(err, req, res, next) {
  res.status(err.status);
  res.render('books/page_not_found', {
    message: err.message,
    error: err
  });
});

sequelize.sync().then(function () {
  app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
  });
});

module.exports = app;
