const User = require("./user.model");

async function getUserById(id) {
  const user = await User.findById(id);
  return user;
}

async function userUpdate(id, data) {
  const userUpdated = await User.findByIdAndUpdate(id, data);
  return userUpdated;
}

async function deleteUser(id) {
  const filter = { deleted: true };
  await userUpdate(id, filter);
}

async function putOrderInUser(userId, orderId, type) {
  const user = await getUserById(userId);
  type === 0
    ? user.libros_comprados.push(orderId)
    : user.libros_vendidos.push(orderId);
  await user.save();
}

module.exports = {
  getUserById,
  userUpdate,
  deleteUser,
  putOrderInUser,
};