const express = require('express');

const router = express.Router();


const {auth, isAdmin} = require('../middlewares/auth');
const {uploadEpub} = require('../middlewares/uploadEpub');
const {uploadImage} = require('../middlewares/uploadImage');

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


// Transactions
const {
    getTransaction,
    getTransactionById,
    storeTransaction,
    updateTransaction
} = require('../controllers/Transaction');

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
router.patch('/book/:id', auth, isAdmin, uploadEpub("bookFile"), updateBook);
router.post('/book',auth, isAdmin, uploadEpub("bookFile"),  storeBook);//uploadFile("bookFile"), nama parameter harus sama dengan yang ada di form user
router.delete('/book/:id', deleteBook);

// Transactions
router.get('/transactions',auth,isAdmin, getTransaction );
router.get('/transaction/:id',auth,isAdmin, getTransactionById );
router.post('/transaction',auth, uploadImage('transferProof'), storeTransaction );
router.patch('/transaction/:id',auth,isAdmin, updateTransaction );

module.exports= router;