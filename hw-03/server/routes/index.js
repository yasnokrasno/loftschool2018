const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

router.get('/', ctrlHome.getIndex);
router.post('/', ctrlHome.postIndex);
router.get('/login', ctrlLogin.getLogin);
router.post('/login', ctrlLogin.handleLogin);
router.get('/admin', ctrlAdmin.isAdmin, ctrlAdmin.getAdmin);
router.post('/admin/skills', ctrlAdmin.postAdminSkills);
router.post('/admin/upload', ctrlAdmin.postAdminProduct);

module.exports = router;
