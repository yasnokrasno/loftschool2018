const express = require('express');
const router = express.Router();

const ctrlIndexPage = require('../controllers/indexPage');

router.get('/', ctrlIndexPage);

module.exports = router;
