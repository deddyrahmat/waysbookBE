const express = require('express');

const router = express.Router();

const {uploadFile} = require('../middlewares/uploadEpub');

// controller
const {register, login} = require('../controllers/Auth');
const {getUsers} = require('../controllers/Users');
const {storeBook} = require('../controllers/Books');

// routing
router.post('/register', register)
router.post('/login', login)

router.get('/users', getUsers);

router.post('/book', uploadFile("fileEpub"), storeBook);

module.exports= router;