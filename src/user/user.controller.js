const userActions = require("./user.actions");
const auth = require("../auth/auth.actions");

async function GetUserById(id) {
  const user = await userActions.getUserById(id);
  return user;
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

module.exports = { GetUserById, updateUser, deleteUser };