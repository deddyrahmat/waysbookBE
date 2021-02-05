const express = require('express');

const router = express.Router();


const {auth, isAdmin} = require('../middlewares/auth');
const {uploadFile} = require('../middlewares/uploadEpub');

// controller
const {register, login} = require('../controllers/Auth');
const {getUsers, deleteUser} = require('../controllers/Users');
const {storeBook} = require('../controllers/Books');

// routing
router.post('/register', register)
router.post('/login', login)

router.get('/users', getUsers);
router.delete('/user/:id', auth, isAdmin, deleteUser);

router.post('/book', uploadFile("fileEpub"), storeBook);

module.exports= router;