const express = require('express');

const router = express.Router();


const {auth, isAdmin} = require('../middlewares/auth');
const {uploadFile} = require('../middlewares/uploadEpub');

// controller

// Auth
const {
    register,
    login
} = require('../controllers/Auth');

// Users
const {
    getUsers, 
    deleteUser
} = require('../controllers/Users');


// Books
const {
    getBooks,
    getBookById,
    storeBook,
    updateBook,
    deleteBook
} = require('../controllers/Books');

// routing

// Auth
router.post('/register', register)
router.post('/login', login)

// Users
router.get('/users', getUsers);
router.delete('/user/:id', auth, isAdmin, deleteUser);

// Books
router.get('/books', getBooks);
router.get('/book/:id', getBookById);
router.patch('/book/:id', auth, isAdmin, uploadFile("bookFile"), updateBook);
router.post('/book',auth, isAdmin, uploadFile("bookFile"),  storeBook);//uploadFile("bookFile"), nama parameter harus sama dengan yang ada di form user
router.delete('/book/:id', deleteBook);

module.exports= router;