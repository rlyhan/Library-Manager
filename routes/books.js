const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');

var Book = require("../models").Book;

/* GET show full list of books */
router.get('/', function(req, res, next) {
  Book.findAll({order: [['title', 'ASC']]}).then(function(books){
    res.render("books/all_books", {books: books});
  }).catch(function(error){
      console.log("500 error");
      res.send(500, error);
  });
});

/* GET show create new book form */
router.get('/new', function(req, res, next) {
  res.render("books/new_book", {book: Book.build()});
});

/* POST add new book to database */
router.post('/new', function(req, res, next) {
  Book.create(req.body).then(function(book) {
    res.redirect("/books/" + book.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("books/new_book", {book: Book.build(req.body), errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
  });
});

/* GET show book detail form */
router.get('/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    res.render("books/book_detail", {book: book});
  }).catch(function(error){
    res.render("error", {});
  });
});

/* POST edit book info */
router.post('/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    return book.update(req.body);
  }).then((book) => {
    res.redirect('/books/' + book.id);
  }).catch(function(error){
    if(error.name === "SequelizeValidationError") {
      console.log(error.errors);
      var book = Book.build(req.body);
      book.id = req.params.id;
      res.render("books/book_detail", {book: book, errors: error.errors});
    } else {
      throw error;
    }
  }).catch(function(error){
      res.send(500, error);
  });
});

/* POST delete book */
router.post('/:id/delete', function(req, res, next){
  Book.findByPk(req.params.id).then((book) => {
    if(book) {
      return book.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect('/books');
  }).catch(function(error){
      res.send(500, error);
  });
});


module.exports = router;
