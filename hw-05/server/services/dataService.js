// let mockUser = {
//   access_token: '23453ff6er354fas',
//   firstName: 'test1',
//   id: 12344,
//   middleName: 'test2',
//   password: '',
//   permission: {
//     chat: { C: true, R: true, U: true, D: true },
//     news: { C: true, R: true, U: true, D: true },
//     setting: { C: true, R: true, U: true, D: true }
//   },
//   permissionId: 1234,
//   surName: 'test3',
//   username: 'testuser'
// };
const sequelize = require('../services/Sequelize');

module.exports.addUser = async function (req, res, next) {
  const allRequiredFieldsFilled = req.username && req.password;
  const emptyAnswer = {};
  if (!allRequiredFieldsFilled) {
    return emptyAnswer;
  }
  const userExists = await checkUsernameExists(req.username, sequelize);
  if (userExists) {
    return emptyAnswer;
  }
  const newUserPlainObject = await saveUserWithPermissionsToDB(req, sequelize);
  return newUserPlainObject;
};

async function saveUserWithPermissionsToDB (rawUserFields, sequelizeInstance) {
  return await sequelizeInstance.transaction(async transaction => {
    return await sequelizeInstance.models.user
      .create(
        rawUserFields,
        {
          transaction,
          include: [{ all: true }]
        }
      );
  }).then(newUser => {
    return preparePlainUserObject(newUser); // todo preparePlainUserObject() function
  }).catch(errorResult => {
    return errorResult;
  });
}

async function checkUsernameExists (username, sequelizeInstance) {
  const foundUser = await sequelizeInstance.models.user.findOne({
    where: { username: username }
  });
  if (foundUser) { // user already exists
    console.log('user found!', foundUser);
  }
  console.log('user NOT found...', foundUser);
  return !!foundUser;
}

function preparePlainUserObject (userModelInstance) {
  if (!('get' in userModelInstance)) { return {}; }
  let plainUserData = userModelInstance.get({ plain: true });
  plainUserData.permissionId = plainUserData.permission.id;
  delete plainUserData.permission.uid;
  delete plainUserData.permission.id;
  return plainUserData;
}
