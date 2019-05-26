const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const db = require('../models/db.js');
const psw = require('../libs/password');

const salt = db.get('passwordSalt').value();
let login = '';
let passwordHash = '';

rl.question('Login: ', answer => {
  login = answer;
  rl.question('Password: ', answer => {
    passwordHash = psw.generatePassword(answer, salt);
    rl.close();
  });
});

rl.on('close', () => {
  db.set('admin.login', login)
    .set('admin.pass', passwordHash)
    .write();
});
