const userActions = require("./user.actions");
const auth = require("../auth/auth.actions");

async function GetUserById(id) {
  const user = await userActions.getUserById(id);
  return user;
}

async function GetUsers() {
  const users = await userActions.getAllUsers();
  return users;
}

async function CreateUser(data) {
  const { contraseña } = data;
  if (contraseña) {
    data.contraseña = await auth.encryptPassword(contraseña);
  }
  const userCreated = await userActions.createUser(data);

  const userCreatedInfo = {
    _id: userCreated._id,
    email: userCreated.email,
    nombre: userCreated.nombre,
  };

  return userCreatedInfo;
}

async function UpdateUser(id, data) {
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

async function DeleteUser(id) {
  const usuario_eliminado = await userActions.deleteUser(id);
  return usuario_eliminado;
}

module.exports = { GetUserById, GetUsers, CreateUser, UpdateUser, DeleteUser };