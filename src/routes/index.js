const express = require('express');

const router = express.Router();


const {auth, isAdmin} = require('../middlewares/auth');
const {uploadFile} = require('../middlewares/uploadFile');

// controller

// Auth
const {
    register,
    login,
    checkAuth
} = require('../controllers/Auth');

// Users
const {
    getUsers, 
    getUserById,
    deleteUser,
} = require('../controllers/Users');


// Books
const {
    getBooks,
    getBookById,
    storeBook,
    updateBook,
    deleteBook
} = require('../controllers/Books');

// BookUser
const {
    getBooksUser,
    getBooksUserById,
    storeBooksUser
} = require('../controllers/BookUsers');

// Transactions
const {
    getTransaction,
    getTransactionById,
    storeTransaction,
    approvedTransaction,
    cancelTransaction,
    expiredTransaction
} = require('../controllers/Transaction');

// routing

// Auth
router.post('/register', register);
router.post('/login', login);
router.get('/check-auth', auth, checkAuth);

// Users
router.get('/users', getUsers);
router.get('/user', auth, getUserById);
router.delete('/user/:id', auth, isAdmin, deleteUser);

// Books
router.get('/books', getBooks);
router.get('/book/:id', getBookById);
router.patch('/book/:id', auth, isAdmin, uploadFile("bookFile"), updateBook);
router.post('/book',auth, isAdmin, uploadFile('thumbnail','bookFile'),  storeBook);//uploadFile("bookFile"), nama parameter harus sama dengan yang ada di form user
router.delete('/book/:id', deleteBook);

// Bookuser
router.get('/bookusers', getBooksUser);
router.get('/bookuser',auth, getBooksUserById);
router.post('/bookuser',auth, storeBooksUser);

// Transactions
router.get('/transactions',auth,isAdmin, getTransaction );
router.get('/transaction/:id',auth,isAdmin, getTransactionById );
router.post('/transaction',auth, uploadFile('attachment'), storeTransaction );
router.patch('/approved-transaction/:id',auth,isAdmin, approvedTransaction );
router.patch('/cancel-transaction/:id',auth,isAdmin, cancelTransaction );
router.patch('/expired-transaction/:id',auth,isAdmin, expiredTransaction );

module.exports= router;