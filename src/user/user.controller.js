const userActions = require("./user.actions");
const auth = require("../auth/auth.actions");

async function GetUserById(id) {
  const user = await userActions.getUserById(id);
  return user;
}

async function createUser(data) {
  const { contraseña } = data;
  if (contraseña) {
    data.contraseña = await auth.encryptPassword(contraseña);
  }
  const userCreated = await userActions.createUser(data);

  const userCreatedInfo = {
    id: userCreated.id,
    email: userCreated.email,
    nombre: userCreated.nombre,
  };

  return userCreatedInfo;
}

async function updateUser(id, data) {
  const { contraseña } = data;
  if (contraseña) {
    data.contraseña = await auth.encryptPassword(contraseña);
  }
  const userUpdated = await userActions.userUpdate(id, data);

  const updatedUserInfo = {
    id: userUpdated.id,
    email: userUpdated.email,
    nombre: userUpdated.nombre,
  };

  return updatedUserInfo;
}

async function deleteUser(id) {
  await userActions.deleteUser(id);
}

module.exports = { GetUserById, createUser, updateUser, deleteUser };