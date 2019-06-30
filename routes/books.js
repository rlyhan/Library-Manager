var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

/* GET show full list of books */
router.get('/books', function(req, res, next) {
  Book.findAll({order: [['title', 'ASC']]}).then(function(books){
    res.render("books/all_books", {books: books, title: "Books"});
  }).catch(function(error){
      console.log("500 error");
      res.send(500, error);
  });
});

/* Show create new book form */
router.get('/books/new', function(req, res, next) {
  res.render("books/new_book", {book: Book.build(), title: "New Book"});
});

/* POST post new book to database */
router.post('/books/new', function(req, res, next) {
  Books.create(req.body).then(function(article) {
    res.redirect("/books/" + book.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var book = Book.build(req.body);
        // book.id = req.params.id;
        res.render("books/form_error", {book: book, errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
  });
});

/* GET show book detail form */
router.get('/books/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    res.render("books/book_detail", {book: book, title: "Update Book"});
  }).catch(function(error){
    res.send(500, error);
    // res.render("../error", { error: error });
  });
});

/* Edit book info */
router.post('/books/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      res.render("books/book_detail", {book: book, title: book.title, author: book.author, genre: book.genre, year: book.year});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
  });
});

/* PUT update book info */
router.put('/books/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then((book) => {
    res.redirect('/books/' + book.id);
  }).catch(function(error){
    if(error.name === "SequelizeValidationError") {
      var book = Book.build(req.body);
      res.render("books/form_error", {book: book, errors: error.errors, title: "New Book"})
    } else {
      throw error;
    }
  }).catch(function(error){
      res.send(500, error);
  });
});

/* Delete book route */
router.get('/books/:id/delete', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      res.render("/books/" + book.id + "/delete", {book: book});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
  });
});

/* POST delete book */
router.post('/books/:id', function(req, res, next){
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
