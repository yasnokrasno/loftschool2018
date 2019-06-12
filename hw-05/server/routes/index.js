const express = require('express');
const router = express.Router();

const ctrlIndexPage = require('../controllers/indexPage');
const ctrlUser = require('../controllers/user');

router.get('/', ctrlIndexPage.getIndex);
router.post('/api/saveNewUser', ctrlUser.createUser);

module.exports = router;
