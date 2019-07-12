const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const Op = sequelize.Op;

var Book = require("../models").Book;

let currentPage;
let limit = 10;
let offset;

/* GET show full list of books */
router.get('/all/:page', function(req, res, next) {
  currentPage = req.params.page;
  offset = (currentPage * 10) - 10;
  Book.findAndCountAll({order: [['title', 'ASC']], limit: limit, offset: offset}).then(function(books){
    var noPages = Math.ceil(books.count / 10);
    res.render("books/all_books", {books: books.rows, pages: noPages});
  }).catch(function(error){
    console.log("500 error");
    res.sendStatus(500).send(error);
  });
});

/* POST search for books based on search query */
router.post('/all/:page', function(req, res, next) {
  var query = req.body.query;
  currentPage = req.params.page;
  offset = (currentPage * 10) - 10;
  Book.findAndCountAll({order: [['title', 'ASC']], limit: limit, offset: offset, where: {
    [Op.or]: [
      {
        title: {
          [Op.like]: '%' + query + '%'
        }
      },
      {
        author: {
          [Op.like]: '%' + query + '%'
        }
      },
      {
        genre: {
          [Op.like]: '%' + query + '%'
        }
      },
      {
        year: {
          [Op.like]: '%' + query + '%'
        }
      }
    ]
  }}).then(function(books){
    var noPages = Math.ceil(books.count / 10);
    res.render("books/all_books", {books: books.rows, pages: noPages});
  }).catch(function(error){
    console.log("500 error");
    res.send(500).send(error);
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
    res.send(500).send(error);
  });
});

/* GET show book detail form */
router.get('/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    res.render("books/book_detail", {book: book});
  }).catch(function(error){
    res.send(500).send(error);
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
      res.send(500).send(error);
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
    res.redirect('/books/all/1');
  }).catch(function(error){
      res.send(500).send(error);
  });
});


module.exports = router;
